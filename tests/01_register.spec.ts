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
    //Use dynamic email to ensure each test is independent and non-repeating.
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

    // 1. Directly redirects to /login, bypassing the GDPR/Cookie masking on the homepage.
    await page.goto('/login');
    // Handling GDPR pop-ups (if any)
    const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
    if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await consentBtn.click();
    }

    // 2. Fill out the first stage of the Signup (Name & Email).
    await loginPage.startSignup(testUser.name, testUser.email);

    // 3. Fill in the second stage of detailed Account Details
    await signupPage.fillAccountDetails(testUser);

    // 4. Verify that the account has been created successfully and click Continue.
    await signupPage.verifyAccountCreated();

    // 5. Verify logged-in status (Header displays "Logged in as Test User")
    await expect(page.locator(`text=Logged in as ${testUser.name}`)).toBeVisible();

    // 6. Delete Account Journey
    await page.locator('a[href="/delete_account"]').click({ force: true });
    await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
    await page.locator('a[data-qa="continue-button"]').click({ force: true });
  });
});