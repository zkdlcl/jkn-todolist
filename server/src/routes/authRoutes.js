const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// 회원가입
router.post("/signup", authController.signup.bind(authController));

// 로그인
router.post("/login", authController.login.bind(authController));

// 로그아웃 (인증 필요)
router.post(
  "/logout",
  authMiddleware,
  authController.logout.bind(authController)
);

module.exports = router;
