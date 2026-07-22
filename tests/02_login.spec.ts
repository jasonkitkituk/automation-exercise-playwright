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

    // 1. Go to the homepage and make sure to click on Signup/Login in the header to enter the /login page.
    await page.goto('/');
    // Handling GDPR pop-ups (if any)
    const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
    if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consentBtn.click();
    }

    await page.locator('a[href="/login"]').click({ force: true });
    await page.waitForURL('**/login');

    // 2. Start registering (enter Name & Email)
    await loginPage.startSignup(testUser.name, testUser.email);

    // 3. Fill out the detailed Signup form
    await signupPage.fillAccountDetails(testUser);
    await signupPage.verifyAccountCreated();

    // 4. After successful registration, click "Logout" to exit and return to the login page to prepare for a "Login" test.
    await page.locator('a[href="/logout"]').click();
    await page.waitForURL('**/login');

    // 5. Testinf of Login with correct credentials
    await loginPage.login(testUser.email, testUser.password);

    // 6. Login verified successfully (confirm that the header shows "Logged in as Test User").
    await expect(page.locator(`text=Logged in as ${testUser.name}`)).toBeVisible();
  });
});