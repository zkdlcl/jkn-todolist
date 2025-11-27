const calendarService = require("../services/calendarService");

class CalendarController {
  /**
   * 달력 데이터 조회 (할일 및 공공 일정)
   * GET /api/calendar/:year/:month
   */
  async getCalendarData(req, res) {
    try {
      const userId = req.user.userId;
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);

      // Validate inputs
      if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          message: "Invalid year or month",
          code: "INVALID_INPUT",
        });
      }

      // Get calendar data (todos and public events)
      const calendarData = await calendarService.getCalendarData(userId, year, month);

      return res.status(200).json({
        success: true,
        data: calendarData,
      });
    } catch (error) {
      console.error("[CalendarController] getCalendarData error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
        code: "INTERNAL_ERROR",
      });
    }
  }
}

module.exports = new CalendarController();