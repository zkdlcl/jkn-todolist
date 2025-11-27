import api from "./apiClient";

const syncAPI = {
  /**
   * 공휴일 데이터 동기화
   * @param {number} year - 동기화할 연도
   * @returns {Promise}
   */
  syncHolidays: (year) => {
    return api.post("/sync/holidays", { year });
  },
};

export default syncAPI;
