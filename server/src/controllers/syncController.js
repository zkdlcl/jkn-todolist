const publicEventSyncService = require("../services/publicEventSyncService");

class SyncController {
  /**
   * 공휴일 데이터 동기화 (관리자용 테스트 API)
   * POST /api/sync/holidays
   */
  async syncHolidays(req, res) {
    try {
      const { year } = req.body;
      const targetYear = year || new Date().getFullYear();

      console.log(`[SyncController] Starting sync for year ${targetYear}...`);

      const results = await publicEventSyncService.syncAll(targetYear);

      return res.status(200).json({
        success: true,
        message: `Successfully synced data for year ${targetYear}`,
        data: results,
      });
    } catch (error) {
      console.error("[SyncController] syncHolidays error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to sync holiday data",
        error: error.message,
      });
    }
  }
}

module.exports = new SyncController();
