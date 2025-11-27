const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 할일 생성
router.post("/", todoController.create.bind(todoController));

// 할일 목록 조회
router.get("/", todoController.getAll.bind(todoController));

// 할일 상세 조회
router.get("/:id", todoController.getById.bind(todoController));

// 할일 수정
router.patch("/:id", todoController.update.bind(todoController));

// 할일 삭제
router.delete("/:id", todoController.delete.bind(todoController));

module.exports = router;
