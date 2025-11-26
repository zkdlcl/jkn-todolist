import { chromium, firefox, webkit } from "@playwright/test";

(async () => {
  // 브라우저 열기
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 로그인 페이지로 이동
  await page.goto("http://localhost:5173/login");
  console.log("로그인 페이지로 이동");

  // 잠시 대기 (페이지 로드 확인용)
  await page.waitForTimeout(2000);

  // 이메일과 비밀번호 입력 (실제 테스트 계정 사용)
  await page.fill('input[type="email"]', "zkdlcl@gmail.com");
  await page.fill('input[type="password"]', "Zkdlcl91@!");
  console.log("로그인 정보 입력");

  // 로그인 버튼 클릭
  await page.click('button[type="submit"]');
  console.log("로그인 시도");

  // 로그인 후 페이지 전환 대기
  await page.waitForTimeout(3000);

  // 현재 페이지 URL 확인
  const currentUrl = page.url();
  console.log("로그인 후 URL:", currentUrl);

  // 로컬 스토리지에 저장된 토큰 확인
  const localStorage = await page.evaluate(() => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key);
    }
    return items;
  });
  console.log("로컬 스토리지 내용:", localStorage);

  // 페이지 새로고침
  await page.reload();
  console.log("페이지 새로고침");

  // 새로고침 후 URL 확인
  await page.waitForTimeout(2000);
  const newUrl = page.url();
  console.log("새로고침 후 URL:", newUrl);

  // 새로고침 후 로컬 스토리지 확인
  const newLocalStorage = await page.evaluate(() => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      items[key] = localStorage.getItem(key);
    }
    return items;
  });
  console.log("새로고침 후 로컬 스토리지 내용:", newLocalStorage);

  // 테스트 완료 후 브라우저 닫기
  console.log("테스트 완료 - 10초 후 브라우저 종료");
  await page.waitForTimeout(10000);
  await browser.close();
})();
