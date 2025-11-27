const pool = require("../config/database");

class PublicEventRepository {
  /**
   * 날짜 범위로 공공 일정(국경일 등) 조회
   * @param {Date} startDate
   * @param {Date} endDate
   * @returns {Promise<Array>}
   */
  async findByDateRange(startDate, endDate) {
    const query = `
      SELECT id, title AS event_name, date AS event_date, type AS event_type,
             CASE WHEN type = 'HOLIDAY' THEN true ELSE false END AS is_holiday,
             created_at
      FROM public_events
      WHERE date BETWEEN $1 AND $2
      ORDER BY date ASC
    `;

    try {
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows;
    } catch (error) {
      console.error("[PublicEventRepository] findByDateRange error:", error);
      throw error;
    }
  }
}

module.exports = new PublicEventRepository();
