import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

test('Journey 1: Register User and Delete Account', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);

  const timestamp = Date.now();
  const userName = `QA_User_${timestamp}`;
  const userEmail = `qa_test_${timestamp}@example.com`;

  await homePage.navigateTo();
  await homePage.clickSignupLogin();

  await loginPage.startSignup(userName, userEmail);

  await signupPage.fillAccountDetails({
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'QA',
    address: '123 Testing St',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile: '1234567890',
  });

  await signupPage.verifyAccountCreated();
  await homePage.verifyLoggedInAs(userName);

  // 清理測試資料
  await homePage.clickDeleteAccount();
});