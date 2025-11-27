const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

// 모든 라우트에 인증 미들웨어 적용
router.use(authMiddleware);

// 휴지통 목록 조회 (순서 중요: /:id 보다 먼저 와야 함)
router.get("/trash/all", todoController.getTrash.bind(todoController));

// 할일 생성
router.post("/", todoController.create.bind(todoController));

// 할일 목록 조회
router.get("/", todoController.getAll.bind(todoController));

// 할일 상세 조회
router.get("/:id", todoController.getById.bind(todoController));

// 할일 수정
router.patch("/:id", todoController.update.bind(todoController));

// 할일 삭제 (Soft Delete)
router.delete("/:id", todoController.delete.bind(todoController));

// 할일 복구
router.patch("/:id/restore", todoController.restore.bind(todoController));

// 할일 영구 삭제
router.delete(
  "/:id/permanent",
  todoController.permanentDelete.bind(todoController)
);

module.exports = router;
