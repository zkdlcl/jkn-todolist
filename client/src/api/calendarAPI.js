import apiClient from "./apiClient";

/**
 * 캘린더 관련 API
 */
const calendarAPI = {
  /**
   * 달력 데이터 조회 (할일 및 공공 일정)
   * @param {number} year - 연도 (YYYY)
   * @param {number} month - 월 (1-12)
   * @returns {Promise}
   */
  getCalendarData: async (year, month) => {
    const response = await apiClient.get(`/calendar/${year}/${month}`);
    return response.data;
  },
};

export default calendarAPI;