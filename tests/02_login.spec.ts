import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

test('Journey 2: User Login with correct credentials', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);

  const timestamp = Date.now();
  const userName = `QA_User_${timestamp}`;
  const userEmail = `qa_login_${timestamp}@example.com`;
  const password = 'Password123!';

  // 1. 先註冊一個保證存在的帳號
  await homePage.navigateTo();
  await homePage.clickSignupLogin();
  await loginPage.startSignup(userName, userEmail);
  await signupPage.fillAccountDetails({
    password: password,
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    state: 'State',
    city: 'City',
    zipcode: '12345',
    mobile: '1234567890',
  });
  await signupPage.verifyAccountCreated();

  // 2. 登出
  //await page.getByRole('link', { name: 'Logout' }).click();
  await homePage.logout();

  // 3. 執行正確憑證登入測試
  await homePage.clickSignupLogin();
  await loginPage.login(userEmail, password);

  // 4. 驗證登入成功
  await homePage.verifyLoggedInAs(userName);
});