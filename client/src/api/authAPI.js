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
