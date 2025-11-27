const todoRepository = require("../repositories/todoRepository");
const publicEventRepository = require("../repositories/publicEventRepository");

class CalendarService {
  /**
   * 달력 데이터 조회 (할일 및 공공 일정)
   * @param {number} userId
   * @param {number} year
   * @param {number} month
   * @returns {Promise<Object>} { todos, publicEvents }
   */
  async getCalendarData(userId, year, month) {
    // Validate inputs
    if (!userId || !year || !month || month < 1 || month > 12) {
      throw new Error("Invalid parameters");
    }

    // Create start and end dates for the specified month
    const startDate = new Date(year, month - 1, 1); // month is 0-indexed in JS
    const endDate = new Date(year, month, 0); // Last day of the month

    // Query todos for the specified month
    const todos = await todoRepository.findByDateRange(userId, startDate, endDate);

    // Query public events (holidays) for the specified month
    const publicEvents = await publicEventRepository.findByDateRange(startDate, endDate);

    return {
      year,
      month,
      todos,
      publicEvents,
    };
  }
}

module.exports = new CalendarService();