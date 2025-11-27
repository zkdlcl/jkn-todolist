import { create } from "zustand";
import todoAPI from "../api/todoAPI";
import calendarAPI from "../api/calendarAPI";

const useTodoStore = create((set, get) => ({
  // State
  todos: [],
  currentTodo: null,
  isLoading: false,
  error: null,
  filters: {
    is_completed: undefined, // undefined: 전체, true: 완료, false: 미완료
    priority: undefined, // undefined: 전체, LOW, MEDIUM, HIGH
  },
  sort: {
    field: "created_at",
    order: "DESC",
  },
  trash: [],
  trashLoading: false,
  calendarEvents: [],

  // Actions
  /**
   * 할일 목록 조회
   */
  fetchTodos: async () => {
    set({ isLoading: true, error: null });
    const { filters, sort } = get();

    try {
      // 필터 파라미터 구성
      const params = {
        sort: sort.field,
        order: sort.order,
      };

      if (filters.is_completed !== undefined) {
        params.is_completed = filters.is_completed;
      }
      if (filters.priority) {
        params.priority = filters.priority;
      }

      const response = await todoAPI.getTodos(params);
      set({ todos: response.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.message ||
          "할일 목록을 불러오는데 실패했습니다.",
      });
    }
  },

  /**
   * 할일 생성
   */
  addTodo: async (todoData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await todoAPI.createTodo(todoData);
      const newTodo = response.data;

      // 목록 갱신 (현재 정렬/필터 유지하면서 추가)
      await get().fetchTodos();

      return { success: true };
    } catch (error) {
      console.error("Failed to create todo:", error);
      const errorMessage =
        error.response?.data?.message || "할일 생성에 실패했습니다.";
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * 할일 수정
   */
  updateTodo: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      await todoAPI.updateTodo(id, updates);
      await get().fetchTodos();

      return { success: true };
    } catch (error) {
      console.error("Failed to update todo:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "할일 수정에 실패했습니다.",
      });
      return { success: false };
    }
  },

  /**
   * 할일 완료 토글 (편의 메서드)
   */
  toggleTodoComplete: async (id, currentStatus) => {
    return await get().updateTodo(id, { is_completed: !currentStatus });
  },

  /**
   * 할일 삭제
   */
  deleteTodo: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await todoAPI.deleteTodo(id);

      // 목록에서 제거
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Failed to delete todo:", error);
      set({
        isLoading: false,
        error: error.response?.data?.message || "할일 삭제에 실패했습니다.",
      });
      return { success: false };
    }
  },

  /**
   * 필터 설정 변경
   */
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchTodos();
  },

  /**
   * 정렬 설정 변경
   */
  setSort: (field, order) => {
    set({ sort: { field, order } });
    get().fetchTodos();
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * 휴지통 목록 조회
   */
  fetchTrash: async () => {
    set({ trashLoading: true, error: null });
    try {
      const response = await todoAPI.getTrash();
      set({ trash: response.data, trashLoading: false });
    } catch (error) {
      console.error("Failed to fetch trash:", error);
      set({
        trashLoading: false,
        error:
          error.response?.data?.message || "휴지통을 불러오는데 실패했습니다.",
      });
    }
  },

  /**
   * 할일 복구
   */
  restoreTodo: async (id) => {
    set({ trashLoading: true, error: null });
    try {
      await todoAPI.restoreTodo(id);

      // 휴지통에서 제거
      set((state) => ({
        trash: state.trash.filter((todo) => todo.id !== id),
        trashLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Failed to restore todo:", error);
      set({
        trashLoading: false,
        error: error.response?.data?.message || "복구에 실패했습니다.",
      });
      return { success: false };
    }
  },

  /**
   * 할일 영구 삭제
   */
  permanentDeleteTodo: async (id) => {
    set({ trashLoading: true, error: null });
    try {
      await todoAPI.permanentDeleteTodo(id);

      // 휴지통에서 제거
      set((state) => ({
        trash: state.trash.filter((todo) => todo.id !== id),
        trashLoading: false,
      }));

      return { success: true };
    } catch (error) {
      console.error("Failed to permanently delete todo:", error);
      set({
        trashLoading: false,
        error: error.response?.data?.message || "영구 삭제에 실패했습니다.",
      });
      return { success: false };
    }
  },

  /**
   * 달력 데이터 조회 (할일 및 공공 일정)
   */
  fetchCalendarData: async (year, month) => {
    set({ isLoading: true, error: null });
    try {
      const response = await calendarAPI.getCalendarData(year, month);
      const { todos, publicEvents } = response.data;

      // Convert public events to calendar events
      const publicEventEvents = publicEvents.map((event) => ({
        id: `public-${event.id}`,
        title: event.event_name,
        start: new Date(event.event_date),
        end: new Date(event.event_date),
        allDay: true,
        isPublicEvent: true,
      }));

      // Convert todos to calendar events
      const todoEvents = todos.map((todo) => {
        const startDate = new Date(todo.start_date || todo.created_at);
        const endDate = new Date(todo.due_date || todo.created_at);

        // Check if dates have specific time (not midnight)
        // Note: This is a simple heuristic. Ideally, we should store an 'all_day' flag in DB.
        // For now, if the user set a specific time in the modal, we treat it as timed event.
        // However, since we don't have an explicit all_day flag, we'll assume timed if it's not exactly midnight
        // OR if start and end are different.
        // But to be safe for Week/Day view visibility, let's default to allDay: false for todos unless explicitly handled.
        // Actually, let's check if hours/minutes are 0.
        const isAllDay =
          startDate.getHours() === 0 &&
          startDate.getMinutes() === 0 &&
          endDate.getHours() === 0 &&
          endDate.getMinutes() === 0;

        return {
          id: todo.id,
          title: todo.title,
          start: startDate,
          end: endDate,
          allDay: isAllDay, // Set based on time
          isPublicEvent: false,
          is_completed: todo.is_completed,
          content: todo.content,
          priority: todo.priority,
        };
      });

      const allEvents = [...todoEvents, ...publicEventEvents];
      set({ calendarEvents: allEvents, isLoading: false });

      return allEvents;
    } catch (error) {
      console.error("Failed to fetch calendar data:", error);
      let errorMessage = "달력 데이터를 불러오는데 실패했습니다.";

      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.";
      } else if (error.response?.status === 500) {
        errorMessage =
          "서버에서 오류가 발생했습니다. 서버 로그를 확인해주세요.";
      } else if (error.response?.status === 404) {
        errorMessage = "요청한 API를 찾을 수 없습니다.";
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
      return [];
    }
  },
}));

export default useTodoStore;
