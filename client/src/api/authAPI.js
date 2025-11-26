import apiClient from "./apiClient";

/**
 * 인증 관련 API
 */
const authAPI = {
  /**
   * 회원가입
   * @param {Object} userData - {email, password, name}
   * @returns {Promise}
   */
  signup: async (userData) => {
    const response = await apiClient.post("/auth/signup", userData);
    return response.data;
  },

  /**
   * 로그인
   * @param {Object} credentials - {email, password}
   * @returns {Promise}
   */
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  /**
   * 사용자 정보 가져오기 (토큰 검증용)
   * @param {string} accessToken
   * @returns {Promise}
   *
   * NOTE: 현재 백엔드에 /auth/me 엔드포인트가 없어 404 오류 발생
   * 토큰 유효성 검사는 restoreAuth 함수에서 JWT 디코딩 방식으로 검증
   */
  // getMe: async (accessToken) => {
  //   // 직접 토큰을 헤더에 포함시켜 요청
  //   const response = await apiClient.get("/auth/me", {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   return response;
  // },

  /**
   * 로그아웃
   * @param {string} refreshToken
   * @returns {Promise}
   */
  logout: async (refreshToken) => {
    const response = await apiClient.post("/auth/logout", { refreshToken });
    return response.data;
  },
};

export default authAPI;
