const authService = require("../services/authService");

/**
 * JWT 인증 미들웨어
 * Authorization 헤더에서 JWT 토큰을 추출하고 검증
 */
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        code: "NO_TOKEN",
      });
    }

    const token = authHeader.substring(7); // 'Bearer ' 제거

    // 토큰 검증
    const decoded = authService.verifyAccessToken(token);

    // req 객체에 사용자 정보 추가
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("[authMiddleware] error:", error);

    if (error.code === "INVALID_TOKEN") {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: "UNAUTHORIZED",
    });
  }
}

module.exports = authMiddleware;
