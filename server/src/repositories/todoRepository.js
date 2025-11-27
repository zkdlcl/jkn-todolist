const pool = require("../config/database");

class TodoRepository {
  /**
   * 할일 생성
   * @param {Object} todoData
   * @returns {Promise<Object>}
   */
  async create(todoData) {
    const {
      user_id,
      title,
      content,
      start_date,
      due_date,
      priority = "MEDIUM",
    } = todoData;

    const query = `
      INSERT INTO todos (
        user_id, title, content, start_date, due_date, priority
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [
        user_id,
        title,
        content,
        start_date,
        due_date,
        priority,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("[TodoRepository] create error:", error);
      throw error;
    }
  }

  /**
   * 할일 목록 조회 (필터링 및 정렬)
   * @param {number} userId
   * @param {Object} filters - { is_completed, priority }
   * @param {Object} sort - { field, order }
   * @returns {Promise<Array>}
   */
  async findAll(
    userId,
    filters = {},
    sort = { field: "created_at", order: "DESC" }
  ) {
    let query = `
      SELECT *
      FROM todos
      WHERE user_id = $1 AND deleted_status = 'ACTIVE'
    `;
    const params = [userId];
    let paramIndex = 2;

    // 필터링
    if (filters.is_completed !== undefined) {
      query += ` AND is_completed = $${paramIndex}`;
      params.push(filters.is_completed);
      paramIndex++;
    }

    if (filters.priority) {
      query += ` AND priority = $${paramIndex}`;
      params.push(filters.priority);
      paramIndex++;
    }

    // 정렬
    const validSortFields = [
      "created_at",
      "due_date",
      "priority",
      "start_date",
    ];
    const sortField = validSortFields.includes(sort.field)
      ? sort.field
      : "created_at";
    const sortOrder = sort.order === "ASC" ? "ASC" : "DESC";

    query += ` ORDER BY ${sortField} ${sortOrder}`;

    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("[TodoRepository] findAll error:", error);
      throw error;
    }
  }

  /**
   * ID로 할일 조회
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async findById(id, userId) {
    const query = `
      SELECT *
      FROM todos
      WHERE id = $1 AND user_id = $2 AND deleted_status = 'ACTIVE'
    `;

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[TodoRepository] findById error:", error);
      throw error;
    }
  }

  /**
   * 할일 수정
   * @param {number} id
   * @param {number} userId
   * @param {Object} updates
   * @returns {Promise<Object|null>}
   */
  async update(id, userId, updates) {
    const { title, content, start_date, due_date, priority, is_completed } =
      updates;

    // 동적 쿼리 생성
    let query = "UPDATE todos SET updated_at = NOW()";
    const params = [id, userId];
    let paramIndex = 3;

    if (title !== undefined) {
      query += `, title = $${paramIndex}`;
      params.push(title);
      paramIndex++;
    }
    if (content !== undefined) {
      query += `, content = $${paramIndex}`;
      params.push(content);
      paramIndex++;
    }
    if (start_date !== undefined) {
      query += `, start_date = $${paramIndex}`;
      params.push(start_date);
      paramIndex++;
    }
    if (due_date !== undefined) {
      query += `, due_date = $${paramIndex}`;
      params.push(due_date);
      paramIndex++;
    }
    if (priority !== undefined) {
      query += `, priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }
    if (is_completed !== undefined) {
      query += `, is_completed = $${paramIndex}`;
      params.push(is_completed);
      paramIndex++;

      // 완료 시 completed_at 업데이트
      if (is_completed) {
        query += `, completed_at = NOW()`;
      } else {
        query += `, completed_at = NULL`;
      }
    }

    query += ` WHERE id = $1 AND user_id = $2 AND deleted_status = 'ACTIVE' RETURNING *`;

    try {
      const result = await pool.query(query, params);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[TodoRepository] update error:", error);
      throw error;
    }
  }

  /**
   * 할일 삭제 (Soft Delete)
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async delete(id, userId) {
    const query = `
      UPDATE todos
      SET deleted_status = 'DELETED', deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_status = 'ACTIVE'
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[TodoRepository] delete error:", error);
      throw error;
    }
  }

  /**
   * 휴지통 목록 조회
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  async findTrash(userId) {
    const query = `
      SELECT *
      FROM todos
      WHERE user_id = $1 AND deleted_status = 'DELETED'
      ORDER BY deleted_at DESC
    `;

    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error("[TodoRepository] findTrash error:", error);
      throw error;
    }
  }

  /**
   * 할일 복구
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<Object|null>}
   */
  async restore(id, userId) {
    const query = `
      UPDATE todos
      SET deleted_status = 'ACTIVE', deleted_at = NULL, updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_status = 'DELETED'
      RETURNING *
    `;

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("[TodoRepository] restore error:", error);
      throw error;
    }
  }

  /**
   * 할일 영구 삭제
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<boolean>}
   */
  async permanentDelete(id, userId) {
    const query = `
      DELETE FROM todos
      WHERE id = $1 AND user_id = $2 AND deleted_status = 'DELETED'
      RETURNING id
    `;

    try {
      const result = await pool.query(query, [id, userId]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("[TodoRepository] permanentDelete error:", error);
      throw error;
    }
  }
}

module.exports = new TodoRepository();
