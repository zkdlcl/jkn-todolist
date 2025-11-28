// @ts-check
const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright E2E 테스트 설정
 *
 * JKN-TODOLIST 프로젝트의 E2E 테스트 설정입니다.
 * 사용자 시나리오 (docs/3-user-scenarios.md)를 기반으로 테스트를 수행합니다.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./tests/e2e",

  /* 테스트 실행 설정 */
  fullyParallel: false, // 순차 실행 (데이터베이스 상태 관리를 위해)
  forbidOnly: !!process.env.CI, // CI 환경에서는 .only 금지
  retries: process.env.CI ? 2 : 0, // CI에서만 재시도
  workers: 1, // 단일 워커 (데이터베이스 충돌 방지)

  /* 리포터 설정 */
  reporter: [["html", { open: "never" }], ["list"]],

  /* 전역 설정 */
  use: {
    /* 기본 URL */
    baseURL: "http://localhost:5173",

    /* 브라우저 설정 - 테스트 과정을 볼 수 있도록 */
    headless: false,

    /* 스크린샷 설정 */
    screenshot: "only-on-failure",
    trace: "on-first-retry",

    /* 타임아웃 설정 */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* 프로젝트별 브라우저 설정 */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  /* 서버는 수동으로 실행되므로 webServer 설정 비활성화 */
  // webServer: [
  //   {
  //     command: "cd server && npm run dev",
  //     url: "http://localhost:3000/api/health",
  //     timeout: 120000,
  //     reuseExistingServer: !process.env.CI,
  //   },
  //   {
  //     command: "cd client && npm run dev",
  //     url: "http://localhost:5173",
  //     timeout: 120000,
  //     reuseExistingServer: !process.env.CI,
  //   },
  // ],
});
