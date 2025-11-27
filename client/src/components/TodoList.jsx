import { useEffect } from "react";
import useTodoStore from "../stores/useTodoStore";
import TodoItem from "./TodoItem";

function TodoList({ onEdit }) {
  const {
    todos,
    isLoading,
    error,
    fetchTodos,
    toggleTodoComplete,
    deleteTodo,
    filters,
    setFilters,
    sort,
    setSort,
  } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleToggle = async (id, currentStatus) => {
    await toggleTodoComplete(id, currentStatus);
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까? 휴지통으로 이동합니다.")) {
      await deleteTodo(id);
    }
  };

  if (isLoading && todos.length === 0) {
    return <div className="text-center py-8 text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 정렬 컨트롤 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilters({ is_completed: undefined })}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filters.is_completed === undefined
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilters({ is_completed: false })}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filters.is_completed === false
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            미완료
          </button>
          <button
            onClick={() => setFilters({ is_completed: true })}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filters.is_completed === true
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            완료
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={filters.priority || ""}
            onChange={(e) =>
              setFilters({ priority: e.target.value || undefined })
            }
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">모든 우선순위</option>
            <option value="HIGH">높음</option>
            <option value="MEDIUM">보통</option>
            <option value="LOW">낮음</option>
          </select>

          <select
            value={`${sort.field}-${sort.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSort(field, order);
            }}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at-DESC">최신순</option>
            <option value="created_at-ASC">오래된순</option>
            <option value="due_date-ASC">마감임박순</option>
            <option value="priority-DESC">중요도순</option>
          </select>
        </div>
      </div>

      {/* 할일 목록 */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              할일이 없습니다. 새로운 할일을 추가해보세요!
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
