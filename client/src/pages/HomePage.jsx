import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import TodoList from "../components/TodoList";
import TodoModal from "../components/TodoModal";
import syncAPI from "../api/syncAPI";

function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // 할일 추가 모달 열기
  const handleAdd = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  // 할일 수정 모달 열기
  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  // 공휴일 동기화
  const handleSync = async () => {
    if (isSyncing) return;

    const currentYear = new Date().getFullYear();
    const confirmed = window.confirm(
      `${currentYear}년 공휴일 데이터를 동기화하시겠습니까?\n(공휴일, 기념일, 24절기, 잡절 포함)`
    );

    if (!confirmed) return;

    setIsSyncing(true);
    try {
      const response = await syncAPI.syncHolidays(currentYear);
      if (response.data.success) {
        alert(`동기화 완료!\n총 ${response.data.data.totalAdded}개 항목 추가`);
      }
    } catch (error) {
      console.error("Sync error:", error);
      alert("동기화 실패: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSyncing(false);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">할일 목록</h2>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">새 할일 추가</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 사이드바 (메뉴) */}
          <div className="lg:col-span-1 space-y-1">
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md"
              onClick={() => navigate("/")}
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
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => navigate("/trash")}
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
              휴지통
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              onClick={() => navigate("/calendar")}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              달력
            </button>

            {/* 공휴일 동기화 버튼 (MVP 테스트용) */}
            <div className="pt-2 mt-2 border-t border-gray-200">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md ${
                  isSyncing
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-green-700 hover:bg-green-50 hover:text-green-900"
                }`}
                onClick={handleSync}
                disabled={isSyncing}
              >
                <svg
                  className={`w-5 h-5 ${isSyncing ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {isSyncing ? "동기화 중..." : "공휴일 동기화"}
              </button>
              <p className="text-xs text-gray-500 mt-1 px-3">MVP 테스트용</p>
            </div>
          </div>

          {/* 할일 목록 영역 */}
          <div className="lg:col-span-3">
            <TodoList onEdit={handleEdit} />
          </div>
        </div>
      </main>

      {/* 할일 추가/수정 모달 */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        todoToEdit={editingTodo}
      />
    </div>
  );
}

export default HomePage;
