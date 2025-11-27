const request = require("supertest");
const app = require("../index");
const pool = require("../src/config/database");

describe("Todo API", () => {
  let accessToken;
  let userId;
  let todoId;

  beforeAll(async () => {
    // 테스트용 사용자 생성 및 로그인
    const email = `todo_test_${Date.now()}@example.com`;
    const password = "Test@1234";

    const signupResponse = await request(app).post("/api/auth/signup").send({
      email,
      password,
      name: "TodoTester",
    });

    accessToken = signupResponse.body.data.accessToken;
    userId = signupResponse.body.data.user.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("POST /api/todos", () => {
    it("should create a new todo successfully", async () => {
      const todoData = {
        title: "Test Todo",
        content: "Test Content",
        priority: "HIGH",
        start_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 86400000).toISOString(), // 내일
      };

      const response = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(todoData.title);
      expect(response.body.data.user_id).toBe(userId);

      todoId = response.body.data.id;
    });

    it("should fail if title is missing", async () => {
      const response = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          content: "No Title",
        })
        .expect(400);

      expect(response.body.code).toBe("INVALID_INPUT");
    });
  });

  describe("GET /api/todos", () => {
    it("should get all todos for the user", async () => {
      const response = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should filter todos by priority", async () => {
      const response = await request(app)
        .get("/api/todos?priority=HIGH")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((todo) => {
        expect(todo.priority).toBe("HIGH");
      });
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should get todo by id", async () => {
      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(todoId);
    });

    it("should return 404 for non-existent todo", async () => {
      await request(app)
        .get("/api/todos/999999")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("should update todo successfully", async () => {
      const updates = {
        title: "Updated Title",
        is_completed: true,
      };

      const response = await request(app)
        .patch(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updates.title);
      expect(response.body.data.is_completed).toBe(true);
      expect(response.body.data.completed_at).not.toBeNull();
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should soft delete todo successfully", async () => {
      const response = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.deleted_status).toBe("DELETED");
      expect(response.body.data.deleted_at).not.toBeNull();
    });

    it("should not find deleted todo in list", async () => {
      const response = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${accessToken}`)
        .expect(200);

      const deletedTodo = response.body.data.find((t) => t.id === todoId);
      expect(deletedTodo).toBeUndefined();
    });
  });
});
