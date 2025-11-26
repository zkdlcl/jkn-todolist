const pool = require("../config/database");

class UserRepository {
  /**
   * 이메일로 사용자 조회
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async findByEmail(email) {
    const query = `
      SELECT id, email, password_hash, name, role, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[UserRepository] findByEmail error:", error);
      throw error;
    }
  }

  /**
   * 사용자 생성
   * @param {Object} userData - {email, password_hash, name, role}
   * @returns {Promise<Object>}
   */
  async create(userData) {
    const { email, password_hash, name, role = "USER" } = userData;

    const query = `
      INSERT INTO users (email, password_hash, name, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role, created_at, updated_at
    `;

    try {
      const result = await pool.query(query, [
        email,
        password_hash,
        name,
        role,
      ]);
      return result.rows[0];
    } catch (error) {
      // 중복 이메일 에러 처리
      if (error.code === "23505") {
        // PostgreSQL unique violation code
        const duplicateError = new Error("Email already exists");
        duplicateError.code = "DUPLICATE_EMAIL";
        throw duplicateError;
      }
      console.error("[UserRepository] create error:", error);
      throw error;
    }
  }

  /**
   * ID로 사용자 조회
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const query = `
      SELECT id, email, name, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[UserRepository] findById error:", error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
