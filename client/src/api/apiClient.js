import axios from "axios";
import useAuthStore from "../stores/useAuthStore";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - 요청 전에 토큰을 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    // console.log("API 요청 전, 현재 토큰:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // console.log("요청에 토큰 추가됨:", accessToken);
    } else {
      // console.log("토큰이 없어서 헤더에 추가하지 않음");
    }
    return config;
  },
  (error) => {
    console.error("요청 인터셉터 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 시 토큰 갱신 시도
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // console.log("API 응답 에러 발생:", error.response?.status, error.message);

    if (error.response?.status === 401 && !originalRequest._retry) {
      // console.log("401 에러 발생, 토큰 갱신 시도");
      originalRequest._retry = true;

      try {
        // refresh 토큰을 사용하여 새로운 access 토큰을 발급받는 API 호출
        const { refreshToken } = useAuthStore.getState();
        // console.log("갱신 시도 시 리프레시 토큰:", refreshToken);

        if (!refreshToken) {
          // 리프레시 토큰이 없다면 로그아웃 처리
          // console.log("리프레시 토큰이 없음, 로그아웃 처리");
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        // 토큰 갱신 API 호출
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const {
          user,
          accessToken,
          refreshToken: newRefreshToken,
        } = response.data;
        // console.log("토큰 갱신 성공:", { user, accessToken, newRefreshToken });

        // 새로운 토큰으로 상태 업데이트
        useAuthStore.getState().setTokens(user, accessToken, newRefreshToken);

        // 원래 요청을 새로운 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        // console.log("갱신된 토큰으로 원래 요청 재시도");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패:", refreshError);
        // 토큰 갱신 실패 시 로그아웃 처리
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
