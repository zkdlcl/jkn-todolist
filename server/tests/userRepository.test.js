const userRepository = require("../src/repositories/userRepository");
const pool = require("../src/config/database");

describe("UserRepository", () => {
  afterAll(async () => {
    await pool.end();
  });

  describe("create", () => {
    it("should create a new user successfully", async () => {
      const userData = {
        email: `test_${Date.now()}@example.com`,
        password_hash: "hashed_password_123",
        name: "테스트사용자",
        role: "USER",
      };

      const user = await userRepository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe("USER");
      expect(user.password_hash).toBeUndefined(); // 비밀번호는 반환하지 않음
    });

    it("should throw error for duplicate email", async () => {
      const userData = {
        email: `duplicate_${Date.now()}@example.com`,
        password_hash: "hashed_password_123",
        name: "중복테스트",
      };

      // 첫 번째 생성
      await userRepository.create(userData);

      // 두 번째 생성 시도 (중복 이메일)
      await expect(userRepository.create(userData)).rejects.toThrow(
        "Email already exists"
      );
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const email = `findtest_${Date.now()}@example.com`;

      // 사용자 생성
      await userRepository.create({
        email,
        password_hash: "hashed_password",
        name: "이메일테스트",
      });

      // 이메일로 조회
      const user = await userRepository.findByEmail(email);

      expect(user).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password_hash).toBeDefined();
    });

    it("should return null for non-existent email", async () => {
      const user = await userRepository.findByEmail("nonexistent@example.com");
      expect(user).toBeNull();
    });
  });

  describe("findById", () => {
    it("should find user by id", async () => {
      // 사용자 생성
      const created = await userRepository.create({
        email: `idtest_${Date.now()}@example.com`,
        password_hash: "hashed_password",
        name: "ID테스트",
      });

      // ID로 조회
      const user = await userRepository.findById(created.id);

      expect(user).toBeDefined();
      expect(user.id).toBe(created.id);
      expect(user.email).toBe(created.email);
      expect(user.password_hash).toBeUndefined(); // findById는 비밀번호 반환하지 않음
    });

    it("should return null for non-existent id", async () => {
      const user = await userRepository.findById(999999);
      expect(user).toBeNull();
    });
  });
});
