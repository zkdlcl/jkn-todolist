import { useEffect } from "react";
import useAuthStore from "./stores/useAuthStore";

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    restoreAuth,
  } = useAuthStore();

  // 컴포넌트 마운트 시 인증 상태 복원
  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  const handleTestLogin = async () => {
    const result = await login({
      email: "test@example.com",
      password: "Test@1234",
    });

    if (result.success) {
      alert("로그인 성공!");
    } else {
      alert(`로그인 실패: ${result.error}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    alert("로그아웃되었습니다");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">JKN-TODOLIST</h1>

        {isLoading && (
          <div className="text-center text-gray-600 mb-4">로딩 중...</div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isAuthenticated ? (
          <div>
            <div className="mb-6">
              <p className="text-lg mb-2">
                인증 상태:{" "}
                <span className="text-green-600 font-semibold">로그인됨</span>
              </p>
              {user && (
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">이메일: {user.email}</p>
                  <p className="text-sm text-gray-600">이름: {user.name}</p>
                  <p className="text-sm text-gray-600">역할: {user.role}</p>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-4 text-center">
              인증 상태:{" "}
              <span className="text-gray-800 font-semibold">로그아웃됨</span>
            </p>
            <button
              onClick={handleTestLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              테스트 로그인
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              (백엔드 서버가 실행 중이어야 합니다)
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">
            FE-02 구현 완료 사항:
          </h2>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>✅ Axios 인스턴스 설정</li>
            <li>✅ 요청/응답 인터셉터</li>
            <li>✅ JWT 자동 헤더 주입</li>
            <li>✅ Zustand 인증 스토어</li>
            <li>✅ 로컬스토리지 토큰 관리</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
