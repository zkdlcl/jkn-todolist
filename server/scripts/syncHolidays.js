require("dotenv").config();
const publicEventSyncService = require("../src/services/publicEventSyncService");

async function syncHolidays() {
  const year = process.argv[2] || new Date().getFullYear();

  console.log(`=== Starting Holiday Sync for Year ${year} ===\n`);

  try {
    const results = await publicEventSyncService.syncAll(year);

    console.log("\n=== Sync Results ===");
    console.log(`Year: ${results.year}`);
    console.log(`Total Added: ${results.totalAdded}`);
    console.log(`Total Errors: ${results.totalErrors}`);

    if (results.totalErrors > 0) {
      console.log("\nErrors:");
      console.log("Holidays:", results.holidays.errors);
      console.log("Anniversaries:", results.anniversaries.errors);
    }

    console.log("\n=== Sync Completed Successfully ===");
    process.exit(0);
  } catch (error) {
    console.error("\n=== Sync Failed ===");
    console.error(error);
    process.exit(1);
  }
}

syncHolidays();
