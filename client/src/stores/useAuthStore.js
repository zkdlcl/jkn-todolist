import { create } from "zustand";
import { persist } from "zustand/middleware";
import authAPI from "../api/authAPI";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      /**
       * 회원가입
       */
      signup: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.signup(userData);
          const { user, accessToken, refreshToken } = response.data;

          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "회원가입에 실패했습니다";
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * 로그인
       */
      login: async (credentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authAPI.login(credentials);
          const { user, accessToken, refreshToken } = response.data;

          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "로그인에 실패했습니다";
          set({ isLoading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },

      /**
       * 로그아웃
       */
      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          const { refreshToken } = get();

          if (refreshToken) {
            await authAPI.logout(refreshToken);
          }

          // 토큰 삭제
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          // 로그아웃은 에러가 나도 로컬 상태는 초기화
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          return { success: true };
        }
      },

      /**
       * 저장된 토큰으로 인증 상태 복원
       */
      restoreAuth: async () => {
        console.log("restoreAuth 호출됨");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        console.log("로컬 스토리지에서 가져온 토큰:", {
          accessToken,
          refreshToken,
        });

        if (accessToken && refreshToken) {
          try {
            // JWT 토큰의 유효성만 확인 (디코딩으로 만료 시간 확인)
            const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
            const isTokenExpired = tokenPayload.exp * 1000 < Date.now();

            if (isTokenExpired) {
              console.log("액세스 토큰이 만료됨, 리프레시 토큰으로 갱신 시도");
              // 토큰이 만료된 경우 서버에 갱신 요청
              const response = await apiClient.post("/auth/refresh", {
                refreshToken,
              });
              const {
                user,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              } = response.data;

              // 새로운 토큰으로 상태 업데이트
              set({
                user,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                isAuthenticated: true,
              });

              // 로컬 스토리지에 새 토큰 저장
              localStorage.setItem("accessToken", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);

              console.log("토큰 갱신 후 상태 업데이트 완료");
            } else {
              // 토큰이 유효하므로 바로 사용자 정보와 함께 상태 업데이트
              const user = {
                id: tokenPayload.userId,
                email: tokenPayload.email,
                name: tokenPayload.name,
                role: tokenPayload.role,
              };

              set({
                user,
                accessToken,
                refreshToken,
                isAuthenticated: true,
              });
              console.log("저장된 토큰이 유효하여 상태 업데이트 완료");
            }
          } catch (error) {
            console.error(
              "restoreAuth - 토큰 유효성 검증 또는 갱신 실패:",
              error
            );
            // 토큰이 유효하지 않거나 갱신에 실패하면 로컬 스토리지에서 제거
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");

            set({
              user: null,
              accessToken: null,
              refreshToken: null,
              isAuthenticated: false,
            });
            console.log("restoreAuth - 토큰 삭제 및 상태 초기화");
          }
        } else {
          console.log("restoreAuth - 저장된 토큰 없음");
        }
      },

      /**
       * 토큰 갱신
       */
      setTokens: (user, accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      /**
       * 에러 초기화
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage", // localStorage의 키 이름
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
