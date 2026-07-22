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
    //Use the official "data-qa" property to improve location stability
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
    //Adding `{force: true }` will allow you to penetrate any transparent ads or pop-ups covering the button.
    await this.loginBtn.click({ force: true });
  }

  async startSignup(name: string, email: string) {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    //await this.signupBtn.click();
    //Adding `{force: true }` will allow you to penetrate any transparent ads or pop-ups covering the button.
    await this.signupBtn.click({ force: true });

    //Ensure the page successfully leads to the detailed Signup page!
    //If the email is duplicated, an error will be displayed here, preventing the invalid process from continuing.
    await this.page.waitForURL('**/signup', { timeout: 10000 });
  }

  async verifyLoginError() {
    await expect(this.loginErrorMessage).toBeVisible({ timeout: 10000 });
  }
}