import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Login Section
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginBtn: Locator;
  readonly loginErrorMessage: Locator;

  // Signup Section
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupBtn: Locator;

  constructor(page: Page) {
    super(page);
// 使用官方 data-qa 屬性提升定位穩定度
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginBtn = page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('form[action="/login"] p');

    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupBtn = page.locator('button[data-qa="signup-button"]');
  }

  async login(email: string, pass: string) {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(pass);
    //await this.loginBtn.click();
    // 加上 { force: true } 穿透任何覆蓋在按鈕上的透明廣告或彈窗  
    await this.loginBtn.click({ force: true });
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    //await this.signupBtn.click();
    // 加上 { force: true } 穿透任何覆蓋在按鈕上的透明廣告或彈窗
    await this.signupBtn.click({ force: true });

    // 關鍵：確保頁面成功進入詳細 Signup 頁面！
    // 如果 Email 重複，這裡會直接報錯，阻止無效流程繼續
    await this.page.waitForURL('**/signup', { timeout: 10000 });
  }

  async verifyLoginError() {
    await expect(this.loginErrorMessage).toBeVisible({ timeout: 10000 });
  }
}