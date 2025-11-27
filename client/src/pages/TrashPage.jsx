import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import useAuthStore from "../stores/useAuthStore";
import useTodoStore from "../stores/useTodoStore";

function TrashPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { trash, trashLoading, fetchTrash, restoreTodo, permanentDeleteTodo } =
    useTodoStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchTrash();
    }
  }, [isAuthenticated, navigate, fetchTrash]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleRestore = async (id) => {
    if (window.confirm("이 할일을 복구하시겠습니까?")) {
      const result = await restoreTodo(id);
      if (result.success) {
        alert("할일이 복구되었습니다.");
      }
    }
  };

  const handlePermanentDelete = async (id) => {
    if (
      window.confirm(
        "정말 영구 삭제하시겠습니까?\n\n영구 삭제 후 복구할 수 없습니다."
      )
    ) {
      const result = await permanentDeleteTodo(id);
      if (result.success) {
        alert("할일이 영구 삭제되었습니다.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm", { locale: ko });
    } catch (e) {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "JEJUHALLASAN, sans-serif" }}
            >
              JKN-TODOLIST
            </h1>
            <div className="flex items-center space-x-4">
              <span
                className="text-lg text-blue-600 hidden sm:inline"
                style={{ fontFamily: "JEJUHALLASAN, sans-serif" }}
              >
                {user?.email?.split("@")[0]}님
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 (메뉴) */}
          <div className="lg:col-span-1 space-y-1">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              할일 목록
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md">
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
              휴지통
            </button>
          </div>

          {/* 휴지통 영역 */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">휴지통</h2>
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>삭제된 할일은 복구하거나 영구 삭제할 수 있습니다.</p>
              </div>
            </div>

            {trashLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : trash.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <p className="mt-2 text-gray-500">휴지통이 비어있습니다.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trash.map((todo) => (
                  <div
                    key={todo.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {todo.title}
                        </h3>
                        {todo.content && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {todo.content}
                          </p>
                        )}
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                          <span>삭제 일시: {formatDate(todo.deleted_at)}</span>
                          {todo.due_date && (
                            <span>마감: {formatDate(todo.due_date)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRestore(todo.id)}
                          className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-300 rounded-md transition-colors"
                        >
                          복구
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(todo.id)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-md transition-colors"
                        >
                          영구삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrashPage;
