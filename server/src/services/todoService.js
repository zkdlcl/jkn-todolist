const todoRepository = require("../repositories/todoRepository");

class TodoService {
  /**
   * 할일 생성
   * @param {number} userId
   * @param {Object} todoData
   * @returns {Promise<Object>}
   */
  async createTodo(userId, todoData) {
    const { title, start_date, due_date } = todoData;

    // 제목 유효성 검사
    if (!title || title.trim().length === 0) {
      const error = new Error("Title is required");
      error.code = "INVALID_INPUT";
      throw error;
    }

    if (title.length > 200) {
      const error = new Error("Title must be less than 200 characters");
      error.code = "INVALID_INPUT";
      throw error;
    }

    // 날짜 유효성 검사
    if (start_date && due_date) {
      const start = new Date(start_date);
      const due = new Date(due_date);
      if (due < start) {
        const error = new Error("Due date must be after start date");
        error.code = "INVALID_DATE";
        throw error;
      }
    }

    return await todoRepository.create({
      user_id: userId,
      ...todoData,
    });
  }

  /**
   * 할일 목록 조회
   * @param {number} userId
   * @param {Object} query - { is_completed, priority, sort, order }
   * @returns {Promise<Array>}
   */
  async getTodos(userId, query) {
    const filters = {};
    if (query.is_completed !== undefined) {
      filters.is_completed = query.is_completed === "true";
    }
    if (query.priority) {
      filters.priority = query.priority;
    }

    const sort = {
      field: query.sort || "created_at",
      order: query.order || "DESC",
    };

    return await todoRepository.findAll(userId, filters, sort);
  }

  /**
   * 할일 상세 조회
   * @param {number} userId
   * @param {number} todoId
   * @returns {Promise<Object>}
   */
  async getTodoById(userId, todoId) {
    const todo = await todoRepository.findById(todoId, userId);

    if (!todo) {
      const error = new Error("Todo not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    return todo;
  }

  /**
   * 할일 수정
   * @param {number} userId
   * @param {number} todoId
   * @param {Object} updates
   * @returns {Promise<Object>}
   */
  async updateTodo(userId, todoId, updates) {
    // 날짜 유효성 검사 (업데이트 시에도 필요)
    if (updates.start_date && updates.due_date) {
      const start = new Date(updates.start_date);
      const due = new Date(updates.due_date);
      if (due < start) {
        const error = new Error("Due date must be after start date");
        error.code = "INVALID_DATE";
        throw error;
      }
    }

    // 기존 할일 조회 (날짜 하나만 업데이트하는 경우를 위해 기존 데이터 필요할 수 있음 - 여기서는 간단히 처리)
    // 만약 start_date만 업데이트하는데 기존 due_date보다 늦으면? -> 이 부분은 클라이언트나 더 정교한 로직에서 처리 권장
    // 여기서는 입력된 값들끼리의 비교만 수행

    const updatedTodo = await todoRepository.update(todoId, userId, updates);

    if (!updatedTodo) {
      const error = new Error("Todo not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    return updatedTodo;
  }

  /**
   * 할일 삭제 (Soft Delete)
   * @param {number} userId
   * @param {number} todoId
   * @returns {Promise<Object>}
   */
  async deleteTodo(userId, todoId) {
    const deletedTodo = await todoRepository.delete(todoId, userId);

    if (!deletedTodo) {
      const error = new Error("Todo not found");
      error.code = "NOT_FOUND";
      throw error;
    }

    return deletedTodo;
  }
}

module.exports = new TodoService();
