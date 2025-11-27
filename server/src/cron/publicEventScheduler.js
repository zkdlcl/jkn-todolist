const cron = require("node-cron");
const publicEventSyncService = require("../services/publicEventSyncService");

class PublicEventScheduler {
  constructor() {
    this.jobs = [];
  }

  /**
   * 연간 자동 동기화 스케줄 등록
   * 매년 7월 1일 오전 3시에 차차년도(+2년) 데이터 동기화
   */
  scheduleAnnualSync() {
    // Cron 표현식: '0 3 1 7 *' = 매년 7월 1일 오전 3시
    const job = cron.schedule(
      "0 3 1 7 *",
      async () => {
        const currentYear = new Date().getFullYear();
        const targetYear = currentYear + 2; // 차차년도

        console.log(
          `[PublicEventScheduler] Starting annual sync for year ${targetYear}...`
        );

        try {
          await publicEventSyncService.syncAll(targetYear);
          console.log(
            `[PublicEventScheduler] Annual sync completed successfully for ${targetYear}`
          );
        } catch (error) {
          console.error(
            `[PublicEventScheduler] Annual sync failed for ${targetYear}:`,
            error
          );
        }
      },
      {
        timezone: "Asia/Seoul",
      }
    );

    this.jobs.push({
      name: "annual-sync",
      schedule: "0 3 1 7 *",
      description: "매년 7월 1일 오전 3시 - 차차년도 공휴일 데이터 동기화",
      job,
    });

    console.log("[PublicEventScheduler] Annual sync job registered");
  }

  /**
   * 임시공휴일 체크 스케줄 등록
   * 매주 월요일 오전 2시에 현재 연도 데이터 재동기화
   */
  scheduleWeeklyCheck() {
    // Cron 표현식: '0 2 * * 1' = 매주 월요일 오전 2시
    const job = cron.schedule(
      "0 2 * * 1",
      async () => {
        const currentYear = new Date().getFullYear();

        console.log(
          `[PublicEventScheduler] Starting weekly check for year ${currentYear}...`
        );

        try {
          await publicEventSyncService.syncHolidays(currentYear);
          console.log(
            `[PublicEventScheduler] Weekly check completed successfully for ${currentYear}`
          );
        } catch (error) {
          console.error(
            `[PublicEventScheduler] Weekly check failed for ${currentYear}:`,
            error
          );
        }
      },
      {
        timezone: "Asia/Seoul",
      }
    );

    this.jobs.push({
      name: "weekly-check",
      schedule: "0 2 * * 1",
      description:
        "매주 월요일 오전 2시 - 현재 연도 공휴일 재동기화 (임시공휴일 대응)",
      job,
    });

    console.log("[PublicEventScheduler] Weekly check job registered");
  }

  /**
   * 모든 스케줄러 시작
   */
  start() {
    console.log("\n[PublicEventScheduler] Starting all scheduled jobs...");

    this.scheduleAnnualSync();
    this.scheduleWeeklyCheck();

    console.log(
      `[PublicEventScheduler] ${this.jobs.length} jobs are now running:`
    );
    this.jobs.forEach((job) => {
      console.log(`  - ${job.name}: ${job.description}`);
      console.log(`    Schedule: ${job.schedule}`);
    });
    console.log("");
  }

  /**
   * 모든 스케줄러 중지
   */
  stop() {
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`[PublicEventScheduler] Stopped job: ${name}`);
    });
    this.jobs = [];
  }

  /**
   * 등록된 작업 목록 조회
   */
  getJobs() {
    return this.jobs.map(({ name, schedule, description }) => ({
      name,
      schedule,
      description,
    }));
  }
}

module.exports = new PublicEventScheduler();
