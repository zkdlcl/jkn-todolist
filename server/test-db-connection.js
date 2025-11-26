const pool = require("./src/config/database");

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await pool.query(
      "SELECT NOW() as current_time, current_database()"
    );
    console.log("✅ Database connection successful!");
    console.log("Current time:", result.rows[0].current_time);
    console.log("Database name:", result.rows[0].current_database);

    // users 테이블 확인
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `);
    console.log("Users table exists:", tables.rows.length > 0);

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
}

testConnection();
