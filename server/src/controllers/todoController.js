const todoService = require("../services/todoService");

class TodoController {
  /**
   * 할일 생성
   * POST /api/todos
   */
  async create(req, res) {
    try {
      const userId = req.user.userId;
      const todoData = req.body;

      const todo = await todoService.createTodo(userId, todoData);

      return res.status(201).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      console.error("[TodoController] create error:", error);

      if (error.code === "INVALID_INPUT" || error.code === "INVALID_DATE") {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: error.code,
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
   * 할일 목록 조회
   * GET /api/todos
   */
  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const query = req.query;

      const todos = await todoService.getTodos(userId, query);

      return res.status(200).json({
        success: true,
        data: todos,
      });
    } catch (error) {
      console.error("[TodoController] getAll error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }

  /**
   * 할일 상세 조회
   * GET /api/todos/:id
   */
  async getById(req, res) {
    try {
      const userId = req.user.userId;
      const todoId = parseInt(req.params.id);

      if (isNaN(todoId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid todo ID",
          code: "INVALID_ID",
        });
      }

      const todo = await todoService.getTodoById(userId, todoId);

      return res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      console.error("[TodoController] getById error:", error);

      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: "NOT_FOUND",
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
   * 할일 수정
   * PATCH /api/todos/:id
   */
  async update(req, res) {
    try {
      const userId = req.user.userId;
      const todoId = parseInt(req.params.id);
      const updates = req.body;

      if (isNaN(todoId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid todo ID",
          code: "INVALID_ID",
        });
      }

      const todo = await todoService.updateTodo(userId, todoId, updates);

      return res.status(200).json({
        success: true,
        data: todo,
      });
    } catch (error) {
      console.error("[TodoController] update error:", error);

      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: "NOT_FOUND",
        });
      }

      if (error.code === "INVALID_DATE") {
        return res.status(400).json({
          success: false,
          message: error.message,
          code: "INVALID_DATE",
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
   * 할일 삭제 (Soft Delete)
   * DELETE /api/todos/:id
   */
  async delete(req, res) {
    try {
      const userId = req.user.userId;
      const todoId = parseInt(req.params.id);

      if (isNaN(todoId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid todo ID",
          code: "INVALID_ID",
        });
      }

      const todo = await todoService.deleteTodo(userId, todoId);

      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully",
        data: todo,
      });
    } catch (error) {
      console.error("[TodoController] delete error:", error);

      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: "NOT_FOUND",
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
   * 휴지통 목록 조회
   * GET /api/todos/trash/all
   */
  async getTrash(req, res) {
    try {
      const userId = req.user.userId;
      const trash = await todoService.getTrash(userId);

      return res.status(200).json({
        success: true,
        data: trash,
      });
    } catch (error) {
      console.error("[TodoController] getTrash error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }

  /**
   * 할일 복구
   * PATCH /api/todos/:id/restore
   */
  async restore(req, res) {
    try {
      const userId = req.user.userId;
      const todoId = parseInt(req.params.id);

      if (isNaN(todoId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid todo ID",
          code: "INVALID_ID",
        });
      }

      const todo = await todoService.restoreTodo(userId, todoId);

      return res.status(200).json({
        success: true,
        message: "Todo restored successfully",
        data: todo,
      });
    } catch (error) {
      console.error("[TodoController] restore error:", error);

      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: "NOT_FOUND",
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
   * 할일 영구 삭제
   * DELETE /api/todos/:id/permanent
   */
  async permanentDelete(req, res) {
    try {
      const userId = req.user.userId;
      const todoId = parseInt(req.params.id);

      if (isNaN(todoId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid todo ID",
          code: "INVALID_ID",
        });
      }

      await todoService.permanentDeleteTodo(userId, todoId);

      return res.status(200).json({
        success: true,
        message: "Todo permanently deleted",
      });
    } catch (error) {
      console.error("[TodoController] permanentDelete error:", error);

      if (error.code === "NOT_FOUND") {
        return res.status(404).json({
          success: false,
          message: error.message,
          code: "NOT_FOUND",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }
}

module.exports = new TodoController();
