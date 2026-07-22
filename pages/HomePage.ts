import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly signupLoginBtn: Locator;
  readonly productsBtn: Locator;
  readonly cartBtn: Locator;
  readonly loggedInAsText: Locator;
  readonly logoutBtn: Locator;
  readonly deleteAccountBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.signupLoginBtn = page.getByRole('link', { name: 'Signup / Login' });
    this.productsBtn = page.getByRole('link', { name: 'Products' });
    this.cartBtn = page.getByRole('link', { name: 'Cart' });
    //this.loggedInAsText = page.locator('header').getByText(/Logged in as/);
    // 改用更精準的 DOM 結構定位 "Logged in as" 元素
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
    this.logoutBtn = page.locator('a[href="/logout"]');
    this.deleteAccountBtn = page.getByRole('link', { name: 'Delete Account' });
    
  }

  async clickSignupLogin() {
    // 加上 { force: true } 繞過蓋在按鈕上面的透明廣告或彈窗
    await this.signupLoginBtn.click({ force: true });
  }

  async clickProducts() {
    await this.productsBtn.click({ force: true });
  }

  async clickCart() {
    await this.cartBtn.click({ force: true });
  }

  async clickDeleteAccount() {
    await this.deleteAccountBtn.click();
  }

  async verifyLoggedInAs(username: string) {
    //await expect(this.loggedInAsText).toContainText(username);
    // 增加等待時間至 10 秒，確保頁面轉址與 DOM 渲染完成
    await expect(this.loggedInAsText).toContainText(username, { timeout: 15000 });
  }

  async logout() {
    await this.logoutBtn.click({ force: true });
  }
}