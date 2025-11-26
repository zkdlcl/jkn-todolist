const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const pool = require("../config/database");

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = "15m"; // 15분
const REFRESH_TOKEN_EXPIRY = "7d"; // 7일

class AuthService {
  /**
   * 회원가입
   * @param {Object} userData - {email, password, name}
   * @returns {Promise<Object>} - {user, accessToken, refreshToken}
   */
  async signup(userData) {
    const { email, password, name } = userData;

    // 이메일 형식 검증
    if (!this.validateEmail(email)) {
      const error = new Error("Invalid email format");
      error.code = "INVALID_EMAIL";
      throw error;
    }

    // 비밀번호 정책 검증
    if (!this.validatePassword(password)) {
      const error = new Error(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      error.code = "WEAK_PASSWORD";
      throw error;
    }

    // 비밀번호 해싱
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // 사용자 생성
    const user = await userRepository.create({
      email,
      password_hash,
      name,
      role: "USER",
    });

    // JWT 토큰 생성
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Refresh Token DB에 저장
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * 로그인
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} - {user, accessToken, refreshToken}
   */
  async login(email, password) {
    // 사용자 조회
    const user = await userRepository.findByEmail(email);

    if (!user) {
      const error = new Error("Invalid email or password");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // JWT 토큰 생성
    const { accessToken, refreshToken } = this.generateTokens(user);

    // Refresh Token DB에 저장
    await this.saveRefreshToken(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * 로그아웃
   * @param {number} userId
   * @param {string} refreshToken
   */
  async logout(userId, refreshToken) {
    const query = `
      DELETE FROM refresh_tokens
      WHERE user_id = $1 AND token = $2
    `;

    await pool.query(query, [userId, refreshToken]);
  }

  /**
   * JWT 토큰 생성
   * @param {Object} user
   * @returns {Object} - {accessToken, refreshToken}
   */
  generateTokens(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  }

  /**
   * Refresh Token DB에 저장
   * @param {number} userId
   * @param {string} refreshToken
   */
  async saveRefreshToken(userId, refreshToken) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7일 후

    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
    `;

    await pool.query(query, [userId, refreshToken, expiresAt]);
  }

  /**
   * 이메일 형식 검증
   * @param {string} email
   * @returns {boolean}
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 비밀번호 정책 검증
   * @param {string} password
   * @returns {boolean}
   */
  validatePassword(password) {
    // 최소 8자, 대문자, 소문자, 숫자, 특수문자 포함
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    return true;
  }

  /**
   * Access Token 검증
   * @param {string} token
   * @returns {Object} decoded payload
   */
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    } catch (error) {
      const authError = new Error("Invalid or expired token");
      authError.code = "INVALID_TOKEN";
      throw authError;
    }
  }
}

module.exports = new AuthService();
