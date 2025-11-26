import { test, expect } from '@playwright/test';

test.describe('Authentication State Persistence', () => {
  test('should maintain login state after page refresh', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('http://localhost:5173/login');

    // 2. 테스트 사용자로 로그인
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호').fill('password123');
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 성공 확인 (홈페이지로 리디렉션되는지 확인)
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText('환영합니다')).toBeVisible();

    // 4. 페이지 새로고침
    await page.reload();

    // 5. 인증 상태 유지 확인
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText('환영합니다')).toBeVisible();
    
    // 6. 토큰이 localStorage에 있는지 확인
    const storage = await page.evaluate(() => localStorage);
    expect(storage.accessToken).toBeDefined();
  });

  test('should redirect to login page when token is invalid/expired', async ({ page }) => {
    // 1. 로그인 페이지로 이동
    await page.goto('http://localhost:5173/login');

    // 2. 테스트 사용자로 로그인
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호').fill('password123');
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 성공 확인
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText('환영합니다')).toBeVisible();

    // 4. 유효하지 않은 토큰으로 교체
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'invalid-token');
    });

    // 5. 페이지 새로고침
    await page.reload();

    // 6. 로그인 페이지로 리디렉션되는지 확인
    await expect(page).toHaveURL('http://localhost:5173/login');
  });

  test('should maintain login state after browser restart', async ({ browser }) => {
    const page = await browser.newPage();

    // 1. 로그인 페이지로 이동
    await page.goto('http://localhost:5173/login');

    // 2. 테스트 사용자로 로그인
    await page.getByLabel('이메일').fill('test@example.com');
    await page.getByLabel('비밀번호').fill('password123');
    await page.getByRole('button', { name: '로그인' }).click();

    // 3. 로그인 성공 확인
    await expect(page).toHaveURL('http://localhost:5173/');
    await expect(page.getByText('환영합니다')).toBeVisible();

    // 4. 브라우저 및 페이지 닫기
    const storageState = await page.context().storageState();
    await page.close();

    // 5. 새로운 브라우저 컨텍스트로 열기
    const newPage = await browser.newPage({ storageState });
    await newPage.goto('http://localhost:5173/');

    // 6. 인증 상태 유지 확인
    await expect(newPage).toHaveURL('http://localhost:5173/');
    await expect(newPage.getByText('환영합니다')).toBeVisible();
  });
});