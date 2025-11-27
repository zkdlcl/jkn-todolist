const pool = require("../config/database");
const kasiAPIService = require("./kasiAPIService");

class PublicEventSyncService {
  /**
   * 공휴일 데이터 동기화
   * @param {number} year - 연도
   * @returns {Promise<Object>} { added, updated, errors }
   */
  async syncHolidays(year) {
    const results = { added: 0, updated: 0, errors: [] };

    try {
      // 1년치 공휴일 데이터를 월별로 가져오기
      for (let month = 1; month <= 12; month++) {
        try {
          const holidays = await kasiAPIService.getMonthlyHolidays(year, month);

          for (const holiday of holidays) {
            try {
              // YYYYMMDD 형식을 YYYY-MM-DD로 변환
              const dateStr = holiday.locdate.toString();
              const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
                4,
                6
              )}-${dateStr.slice(6, 8)}`;

              // DB에 삽입 또는 업데이트 (UPSERT)
              const query = `
                INSERT INTO public_events (title, date, type, created_at, updated_at)
                VALUES ($1, $2, $3, NOW(), NOW())
                ON CONFLICT (date, title) 
                DO UPDATE SET 
                  type = EXCLUDED.type,
                  updated_at = NOW()
                RETURNING id
              `;

              const result = await pool.query(query, [
                holiday.dateName,
                formattedDate,
                holiday.isHoliday === "Y" ? "HOLIDAY" : "NOTICE",
              ]);

              if (result.rowCount > 0) {
                results.added++;
              }
            } catch (error) {
              results.errors.push({
                item: holiday.dateName,
                error: error.message,
              });
            }
          }
        } catch (error) {
          results.errors.push({
            month,
            error: error.message,
          });
        }
      }

      console.log(
        `[PublicEventSyncService] Sync completed for ${year}:`,
        results
      );
      return results;
    } catch (error) {
      console.error("[PublicEventSyncService] syncHolidays error:", error);
      throw error;
    }
  }

  /**
   * 특정 연도의 기념일 동기화
   * @param {number} year - 연도
   * @returns {Promise<Object>}
   */
  async syncAnniversary(year) {
    const results = { added: 0, updated: 0, errors: [] };

    try {
      const events = await kasiAPIService.getAnnualEvents(year);

      for (const event of events) {
        try {
          const dateStr = event.locdate.toString();
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
            4,
            6
          )}-${dateStr.slice(6, 8)}`;

          const query = `
            INSERT INTO public_events (title, date, type, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (date, title) 
            DO UPDATE SET 
              type = EXCLUDED.type,
              updated_at = NOW()
            RETURNING id
          `;

          await pool.query(query, [
            event.dateName,
            formattedDate,
            "NOTICE", // 기념일은 NOTICE로 분류
          ]);

          results.added++;
        } catch (error) {
          results.errors.push({
            item: event.dateName,
            error: error.message,
          });
        }
      }

      console.log(
        `[PublicEventSyncService] Anniversary sync completed for ${year}:`,
        results
      );
      return results;
    } catch (error) {
      console.error("[PublicEventSyncService] syncAnniversary error:", error);
      throw error;
    }
  }

  /**
   * 24절기 데이터 동기화
   * @param {number} year - 연도
   * @returns {Promise<Object>}
   */
  async sync24Divisions(year) {
    const results = { added: 0, updated: 0, errors: [] };

    try {
      const divisions = await kasiAPIService.get24DivisionsInfo(year);

      for (const division of divisions) {
        try {
          const dateStr = division.locdate.toString();
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
            4,
            6
          )}-${dateStr.slice(6, 8)}`;

          const query = `
            INSERT INTO public_events (title, date, type, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (date, title) 
            DO UPDATE SET 
              type = EXCLUDED.type,
              updated_at = NOW()
            RETURNING id
          `;

          await pool.query(query, [
            division.dateName,
            formattedDate,
            "SOLAR_TERM", // 24절기
          ]);

          results.added++;
        } catch (error) {
          results.errors.push({
            item: division.dateName,
            error: error.message,
          });
        }
      }

      console.log(
        `[PublicEventSyncService] 24 Divisions sync completed for ${year}:`,
        results
      );
      return results;
    } catch (error) {
      console.error("[PublicEventSyncService] sync24Divisions error:", error);
      throw error;
    }
  }

  /**
   * 잡절 데이터 동기화
   * @param {number} year - 연도
   * @returns {Promise<Object>}
   */
  async syncSundryDay(year) {
    const results = { added: 0, updated: 0, errors: [] };

    try {
      const sundryDays = await kasiAPIService.getSundryDayInfo(year);

      for (const day of sundryDays) {
        try {
          const dateStr = day.locdate.toString();
          const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(
            4,
            6
          )}-${dateStr.slice(6, 8)}`;

          const query = `
            INSERT INTO public_events (title, date, type, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
            ON CONFLICT (date, title) 
            DO UPDATE SET 
              type = EXCLUDED.type,
              updated_at = NOW()
            RETURNING id
          `;

          await pool.query(query, [
            day.dateName,
            formattedDate,
            "SEASONAL_DAY", // 잡절
          ]);

          results.added++;
        } catch (error) {
          results.errors.push({
            item: day.dateName,
            error: error.message,
          });
        }
      }

      console.log(
        `[PublicEventSyncService] Sundry Day sync completed for ${year}:`,
        results
      );
      return results;
    } catch (error) {
      console.error("[PublicEventSyncService] syncSundryDay error:", error);
      throw error;
    }
  }

  /**
   * 전체 동기화 (공휴일 + 기념일 + 24절기 + 잡절)
   * @param {number} year - 연도
   * @returns {Promise<Object>}
   */
  async syncAll(year) {
    console.log(
      `[PublicEventSyncService] Starting full sync for year ${year}...`
    );

    try {
      const holidayResults = await this.syncHolidays(year);
      const anniversaryResults = await this.syncAnniversary(year);
      const divisionsResults = await this.sync24Divisions(year);
      const sundryResults = await this.syncSundryDay(year);

      const totalResults = {
        year,
        holidays: holidayResults,
        anniversaries: anniversaryResults,
        divisions24: divisionsResults,
        sundryDays: sundryResults,
        totalAdded:
          holidayResults.added +
          anniversaryResults.added +
          divisionsResults.added +
          sundryResults.added,
        totalErrors:
          holidayResults.errors.length +
          anniversaryResults.errors.length +
          divisionsResults.errors.length +
          sundryResults.errors.length,
      };

      console.log(
        "[PublicEventSyncService] Full sync completed:",
        totalResults
      );
      return totalResults;
    } catch (error) {
      console.error("[PublicEventSyncService] syncAll error:", error);
      throw error;
    }
  }
}

module.exports = new PublicEventSyncService();
