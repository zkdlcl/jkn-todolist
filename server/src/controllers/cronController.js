const publicEventSyncService = require("../services/publicEventSyncService");

class CronController {
  /**
   * 주간 동기화 (올해 데이터 갱신 - 임시공휴일 등 반영)
   * GET /api/cron/weekly-sync
   */
  async weeklySync(req, res) {
    try {
      const currentYear = new Date().getFullYear();
      console.log(`[Cron] Starting weekly sync for year ${currentYear}...`);

      const results = await publicEventSyncService.syncHolidays(currentYear);

      res.status(200).json({
        success: true,
        message: `Weekly sync completed for ${currentYear}`,
        data: results,
      });
    } catch (error) {
      console.error("[Cron] Weekly sync failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * 연간 동기화 (내후년 데이터 미리 확보)
   * GET /api/cron/annual-sync
   */
  async annualSync(req, res) {
    try {
      const targetYear = new Date().getFullYear() + 2;
      console.log(`[Cron] Starting annual sync for year ${targetYear}...`);

      const results = await publicEventSyncService.syncAll(targetYear);

      res.status(200).json({
        success: true,
        message: `Annual sync completed for ${targetYear}`,
        data: results,
      });
    } catch (error) {
      console.error("[Cron] Annual sync failed:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CronController();
