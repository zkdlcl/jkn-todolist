import { create } from "zustand";
import authAPI from "../api/authAPI";

const useAuthStore = create((set, get) => ({
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
  restoreAuth: () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      // TODO: 토큰 유효성 검증 및 사용자 정보 조회
      // 현재는 토큰만 복원
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    }
  },

  /**
   * 에러 초기화
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
