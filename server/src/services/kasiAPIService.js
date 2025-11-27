const axios = require("axios");

class KasiAPIService {
  constructor() {
    this.baseURL =
      process.env.KASI_API_BASE_URL ||
      "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService";
    this.apiKey = process.env.KASI_API_KEY;

    if (!this.apiKey) {
      console.warn("[KasiAPIService] API key not configured");
    }
  }

  /**
   * 월별 공휴일 조회
   * @param {number} year - 연도 (YYYY)
   * @param {number} month - 월 (1~12)
   * @returns {Promise<Array>}
   */
  async getMonthlyHolidays(year, month) {
    try {
      const response = await axios.get(`${this.baseURL}/getRestDeInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          solMonth: month.toString().padStart(2, "0"),
          _type: "json",
        },
      });

      const items = response.data?.response?.body?.items?.item;
      if (!items) return [];

      // 배열이 아닌 경우 배열로 변환 (단일 아이템인 경우)
      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error(
        "[KasiAPIService] getMonthlyHolidays error:",
        error.message
      );
      throw error;
    }
  }

  /**
   * 연간 기념일 조회
   * @param {number} year - 연도 (YYYY)
   * @returns {Promise<Array>}
   */
  async getAnnualEvents(year) {
    try {
      const response = await axios.get(`${this.baseURL}/getAnniversaryInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          _type: "json",
        },
      });

      const items = response.data?.response?.body?.items?.item;
      if (!items) return [];

      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error("[KasiAPIService] getAnnualEvents error:", error.message);
      throw error;
    }
  }

  /**
   * 월별 국경일 조회
   * @param {number} year - 연도 (YYYY)
   * @param {number} month - 월 (1~12)
   * @returns {Promise<Array>}
   */
  async getHoliDeInfo(year, month) {
    try {
      const response = await axios.get(`${this.baseURL}/getHoliDeInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          solMonth: month.toString().padStart(2, "0"),
          _type: "json",
        },
      });

      const items = response.data?.response?.body?.items?.item;
      if (!items) return [];

      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error("[KasiAPIService] getHoliDeInfo error:", error.message);
      throw error;
    }
  }

  /**
   * 24절기 정보 조회
   * @param {number} year - 연도 (YYYY)
   * @returns {Promise<Array>}
   */
  async get24DivisionsInfo(year) {
    try {
      const response = await axios.get(`${this.baseURL}/get24DivisionsInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          _type: "json",
        },
      });

      const items = response.data?.response?.body?.items?.item;
      if (!items) return [];

      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error(
        "[KasiAPIService] get24DivisionsInfo error:",
        error.message
      );
      throw error;
    }
  }

  /**
   * 잡절 정보 조회
   * @param {number} year - 연도 (YYYY)
   * @returns {Promise<Array>}
   */
  async getSundryDayInfo(year) {
    try {
      const response = await axios.get(`${this.baseURL}/getSundryDayInfo`, {
        params: {
          serviceKey: this.apiKey,
          solYear: year,
          _type: "json",
        },
      });

      const items = response.data?.response?.body?.items?.item;
      if (!items) return [];

      return Array.isArray(items) ? items : [items];
    } catch (error) {
      console.error("[KasiAPIService] getSundryDayInfo error:", error.message);
      throw error;
    }
  }
}

module.exports = new KasiAPIService();
