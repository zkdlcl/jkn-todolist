const authService = require("../services/authService");

class AuthController {
  /**
   * 회원가입 POST /api/auth/signup
   */
  async signup(req, res) {
    try {
      const { email, password, name } = req.body;

      // 입력값 검증
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Email, password, and name are required",
          code: "MISSING_FIELDS",
        });
      }

      const result = await authService.signup({ email, password, name });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("[AuthController] signup error:", error);

      if (error.code === "DUPLICATE_EMAIL") {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
          code: "DUPLICATE_EMAIL",
        });
      }

      if (error.code === "INVALID_EMAIL") {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: "INVALID_EMAIL",
        });
      }

      if (error.code === "WEAK_PASSWORD") {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: "WEAK_PASSWORD",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }

  /**
   * 로그인 POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 입력값 검증
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
          code: "MISSING_FIELDS",
        });
      }

      const result = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("[AuthController] login error:", error);

      if (error.code === "INVALID_CREDENTIALS") {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
          code: "INVALID_CREDENTIALS",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }

  /**
   * 로그아웃 POST /api/auth/logout
   */
  async logout(req, res) {
    try {
      const userId = req.user.userId; // JWT 미들웨어에서 추출
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token is required",
          code: "MISSING_TOKEN",
        });
      }

      await authService.logout(userId, refreshToken);

      return res.status(200).json({
        success: true,
        message: "로그아웃되었습니다",
      });
    } catch (error) {
      console.error("[AuthController] logout error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }
}

module.exports = new AuthController();
