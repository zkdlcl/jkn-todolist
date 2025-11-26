import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

function HomePage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "JEJUHALLASAN, sans-serif" }}
            >
              JKN-TODOLIST
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user?.name}님</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            환영합니다, {user?.name}님!
          </h2>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                ✅ Phase 2 완료
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 사용자 인증 시스템 구현 완료</li>
                <li>• 로그인/회원가입 UI 구현 완료</li>
                <li>• JWT 토큰 관리 구현 완료</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <h3 className="font-medium text-yellow-900 mb-2">
                🚧 다음 단계: Phase 3
              </h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 할일 CRUD API 연동</li>
                <li>• 할일 목록 UI 구현</li>
                <li>• 할일 추가/수정 모달</li>
              </ul>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                사용자 정보
              </h3>
              <dl className="text-sm space-y-1">
                <div className="flex">
                  <dt className="w-20 text-gray-600">이메일:</dt>
                  <dd className="text-gray-900">{user?.email}</dd>
                </div>
                <div className="flex">
                  <dt className="w-20 text-gray-600">이름:</dt>
                  <dd className="text-gray-900">{user?.name}</dd>
                </div>
                <div className="flex">
                  <dt className="w-20 text-gray-600">역할:</dt>
                  <dd className="text-gray-900">{user?.role}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
