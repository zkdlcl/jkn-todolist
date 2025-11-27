import { format } from "date-fns";
import { ko } from "date-fns/locale";

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const { id, title, due_date, priority, is_completed, completed_at } = todo;

  // 우선순위별 배지 스타일
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            높음
          </span>
        );
      case "MEDIUM":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            보통
          </span>
        );
      case "LOW":
        return (
          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            낮음
          </span>
        );
      default:
        return null;
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: ko });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
        is_completed ? "bg-gray-50" : ""
      }`}
    >
      <div className="flex items-center flex-1 min-w-0 mr-4">
        {/* 체크박스 */}
        <input
          type="checkbox"
          checked={is_completed}
          onChange={() => onToggle(id, is_completed)}
          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
        />

        <div className="ml-4 flex-1 min-w-0">
          {/* 제목 및 배지 */}
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`text-base font-medium truncate ${
                is_completed ? "text-gray-400 line-through" : "text-gray-900"
              }`}
            >
              {title}
            </h3>
            {getPriorityBadge(priority)}
          </div>

          {/* 날짜 정보 */}
          <div className="text-xs text-gray-500 flex items-center gap-2">
            {due_date && (
              <span
                className={`${
                  !is_completed && new Date(due_date) < new Date()
                    ? "text-red-500 font-medium"
                    : ""
                }`}
              >
                마감: {formatDate(due_date)}
              </span>
            )}
            {completed_at && (
              <span className="text-green-600">
                (완료: {formatDate(completed_at)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 액션 버튼 (Hover 시 표시) */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="수정"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="삭제"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
