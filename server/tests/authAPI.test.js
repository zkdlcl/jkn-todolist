const request = require("supertest");
const app = require("../index");
const pool = require("../src/config/database");

describe("Auth API", () => {
  let server;

  beforeAll(() => {
    // 테스트용 서버는 3001 포트 사용
    server = app.listen(3001);
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        email: `test_${Date.now()}@example.com`,
        password: "Test@1234",
        name: "테스트사용자",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject weak password", async () => {
      const userData = {
        email: `test_${Date.now()}@example.com`,
        password: "weak",
        name: "테스트",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("WEAK_PASSWORD");
    });

    it("should reject duplicate email", async () => {
      const userData = {
        email: `duplicate_${Date.now()}@example.com`,
        password: "Test@1234",
        name: "중복테스트",
      };

      // 첫 번째 가입
      await request(app).post("/api/auth/signup").send(userData).expect(201);

      // 두 번째 가입 시도
      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("DUPLICATE_EMAIL");
    });

    it("should reject invalid email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "Test@1234",
        name: "테스트",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("INVALID_EMAIL");
    });
  });

  describe("POST /api/auth/login", () => {
    const testUser = {
      email: `login_test_${Date.now()}@example.com`,
      password: "Test@1234",
      name: "로그인테스트",
    };

    beforeAll(async () => {
      // 테스트용 사용자 생성
      await request(app).post("/api/auth/signup").send(testUser);
    });

    it("should login successfully with correct credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it("should reject wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword@123",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });

    it("should reject non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Test@1234",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.code).toBe("INVALID_CREDENTIALS");
    });
  });

  describe("POST /api/auth/logout", () => {
    let accessToken;
    let refreshToken;

    beforeAll(async () => {
      // 테스트용 사용자 생성 및 로그인
      const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send({
          email: `logout_test_${Date.now()}@example.com`,
          password: "Test@1234",
          name: "로그아웃테스트",
        });

      accessToken = signupResponse.body.data.accessToken;
      refreshToken = signupResponse.body.data.refreshToken;
    });

    it("should logout successfully", async () => {
      const response = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it("should reject logout without token", async () => {
      await request(app)
        .post("/api/auth/logout")
        .send({ refreshToken })
        .expect(401);
    });
  });
});
