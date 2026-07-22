// tests/01_register.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

test.describe('Journey 1: Register User and Delete Account', () => {
  let loginPage: LoginPage;
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
  });

  test('Journey 1: Register User and Delete Account', async ({ page }) => {
    // 使用動態 Email 確保每次測試獨立且不重複
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
      country: 'United States'
    };

    // 1. 直接導向 /login，避開首頁的 GDPR/Cookie 遮罩
    await page.goto('/login');
    // 處理 GDPR 彈窗 (若有)
    const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
    if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consentBtn.click();
    }

    // 2. 填寫第一階段的 Signup (Name & Email)
    await loginPage.startSignup(testUser.name, testUser.email);

    // 3. 填寫第二階段詳細 Account Details
    await signupPage.fillAccountDetails(testUser);

    // 4. 驗證帳號建立成功並點擊 Continue
    await signupPage.verifyAccountCreated();

    // 5. 驗證已登入狀態 (Header 顯示 Logged in as Test User)
    await expect(page.locator(`text=Logged in as ${testUser.name}`)).toBeVisible();

    // 6. 刪除帳號 (Delete Account Journey)
    await page.locator('a[href="/delete_account"]').click({ force: true });
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
    await page.locator('a[data-qa="continue-button"]').click({ force: true });
  });
});