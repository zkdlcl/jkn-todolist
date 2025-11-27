import apiClient from "./apiClient";

/**
 * 할일 관련 API
 */
const todoAPI = {
  /**
   * 할일 목록 조회
   * @param {Object} params - { is_completed, priority, sort, order }
   * @returns {Promise}
   */
  getTodos: async (params = {}) => {
    const response = await apiClient.get("/todos", { params });
    return response.data;
  },

  /**
   * 할일 생성
   * @param {Object} todoData - { title, content, start_date, due_date, priority }
   * @returns {Promise}
   */
  createTodo: async (todoData) => {
    const response = await apiClient.post("/todos", todoData);
    return response.data;
  },

  /**
   * 할일 상세 조회
   * @param {number} id
   * @returns {Promise}
   */
  getTodoById: async (id) => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  },

  /**
   * 할일 수정
   * @param {number} id
   * @param {Object} updates
   * @returns {Promise}
   */
  updateTodo: async (id, updates) => {
    const response = await apiClient.patch(`/todos/${id}`, updates);
    return response.data;
  },

  /**
   * 할일 삭제 (Soft Delete)
   * @param {number} id
   * @returns {Promise}
   */
  deleteTodo: async (id) => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data;
  },

  /**
   * 휴지통 목록 조회
   * @returns {Promise}
   */
  getTrash: async () => {
    const response = await apiClient.get("/todos/trash/all");
    return response.data;
  },

  /**
   * 할일 복구
   * @param {number} id
   * @returns {Promise}
   */
  restoreTodo: async (id) => {
    const response = await apiClient.patch(`/todos/${id}/restore`);
    return response.data;
  },

  /**
   * 할일 영구 삭제
   * @param {number} id
   * @returns {Promise}
   */
  permanentDeleteTodo: async (id) => {
    const response = await apiClient.delete(`/todos/${id}/permanent`);
    return response.data;
  },
};

export default todoAPI;
