// tests/02_login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

test.describe('Journey 2: User Login', () => {
  let loginPage: LoginPage;
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
  });

  test('Journey 2: User Login with correct credentials', async ({ page }) => {
    const timestamp = Date.now();
    const testUser = {
      name: 'Test User',
      email: `testuser_${timestamp}@example.com`,
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test Street',
      state: 'California',
      city: 'Los Angeles',
      zipcode: '90001',
      mobile: '1234567890',
    };

    // 1. 前往首頁並確保點擊 Header 的 Signup/Login 進入 /login 頁面
    await page.goto('/');
    // 處理 GDPR 彈窗 (若有)
    const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
    if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consentBtn.click();
    }

    // 穿透點擊
    await page.locator('a[href="/login"]').click({ force: true });
    await page.waitForURL('**/login');

    // 2. 開始註冊 (填寫 Name & Email)
    await loginPage.startSignup(testUser.name, testUser.email);

    // 3. 填寫詳細 Signup 表單
    await signupPage.fillAccountDetails(testUser);
    await signupPage.verifyAccountCreated();

    // 4. 註冊成功後，點擊 Logout 登出，回歸登入頁面準備測試「登入」
    await page.locator('a[href="/logout"]').click();
    await page.waitForURL('**/login');

    // 5. 執行真正要測試的「登入」邏輯 (Login with correct credentials)
    await loginPage.login(testUser.email, testUser.password);

    // 6. 驗證登入成功 (確認 Header 出現 Logged in as Test User)
    await expect(page.locator(`text=Logged in as ${testUser.name}`)).toBeVisible();
  });
});