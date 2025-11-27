const request = require("supertest");
const app = require("../index");
const pool = require("../src/config/database");

describe("Trash API", () => {
  let accessToken;
  let userId;
  let todoId;

  beforeAll(async () => {
    // 테스트용 사용자 생성 및 로그인
    const email = `trash_test_${Date.now()}@example.com`;
    const password = "Test@1234";

    const signupResponse = await request(app).post("/api/auth/signup").send({
      email,
      password,
      name: "TrashTester",
    });

    accessToken = signupResponse.body.data.accessToken;
    userId = signupResponse.body.data.user.id;

    // 테스트용 할일 생성
    const todoResponse = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Trash Test Todo",
        priority: "LOW",
      });

    todoId = todoResponse.body.data.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("Trash Workflow", () => {
    it("should soft delete the todo", async () => {
      const response = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.data.deleted_status).toBe("DELETED");
    });

    it("should find the deleted todo in trash", async () => {
      const response = await request(app)
        .get("/api/todos/trash/all")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      const trashItem = response.body.data.find((t) => t.id === todoId);
      expect(trashItem).toBeDefined();
      expect(trashItem.deleted_status).toBe("DELETED");
    });

    it("should restore the todo", async () => {
      const response = await request(app)
        .patch(`/api/todos/${todoId}/restore`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted_status).toBe("ACTIVE");
      expect(response.body.data.deleted_at).toBeNull();
    });

    it("should not find the restored todo in trash", async () => {
      const response = await request(app)
        .get("/api/todos/trash/all")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const trashItem = response.body.data.find((t) => t.id === todoId);
      expect(trashItem).toBeUndefined();
    });

    it("should permanently delete the todo", async () => {
      // 먼저 다시 삭제 (Soft Delete)
      await request(app)
        .delete(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      // 영구 삭제
      const response = await request(app)
        .delete(`/api/todos/${todoId}/permanent`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should not find the permanently deleted todo anywhere", async () => {
      // 일반 목록 조회
      const listResponse = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
      expect(
        listResponse.body.data.find((t) => t.id === todoId)
      ).toBeUndefined();

      // 휴지통 조회
      const trashResponse = await request(app)
        .get("/api/todos/trash/all")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);
      expect(
        trashResponse.body.data.find((t) => t.id === todoId)
      ).toBeUndefined();
    });
  });
});
