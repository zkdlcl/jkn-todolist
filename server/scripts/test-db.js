const pool = require("../src/config/database");

async function test() {
  try {
    console.log("Testing public_events query...");
    const res = await pool.query("SELECT * FROM public_events LIMIT 1");
    console.log("Success! Table exists.");
    console.log("Rows:", res.rows);
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await pool.end();
  }
}

test();
