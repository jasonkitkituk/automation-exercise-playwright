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
    //Use more precise DOM structure positioning for "Logged in as" elements.
    this.loggedInAsText = page.locator('li:has-text("Logged in as")');
    this.logoutBtn = page.locator('a[href="/logout"]');
    this.deleteAccountBtn = page.getByRole('link', { name: 'Delete Account' });
    
  }

  async clickSignupLogin() {
    //Adding `{force: true }` bypasses transparent ads or pop-ups covering buttons.
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
    //Add a waiting time 15 seconds to ensure page redirection and DOM rendering are complete.
    await expect(this.loggedInAsText).toContainText(username, { timeout: 15000 });
  }

  async logout() {
    await this.logoutBtn.click({ force: true });
  }
}