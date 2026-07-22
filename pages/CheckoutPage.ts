import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  //readonly proceedToCheckoutBtn: Locator;
  readonly placeOrderBtn: Locator;

  // Payment
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmBtn: Locator;

  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.proceedToCheckoutBtn = page.locator('.check_out');
    this.placeOrderBtn = page.getByRole('link', { name: 'Place Order' });

    this.nameOnCardInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cvcInput = page.locator('input[name="cvc"]');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]');
    this.expiryYearInput = page.locator('input[name="expiry_year"]');
    this.payAndConfirmBtn = page.locator('#submit');

    this.successMessage = page.locator('[data-qa="order-placed"]');
  }

// 使用精確的 text 或 class locator
  private proceedToCheckoutBtn = this.page.locator('a.check_out, .check_out');

// 1. 在 /view_cart 頁面使用的按鈕
  async clickProceedToCheckout() {
    const btn = this.page.locator('a.check_out', { hasText: 'Proceed To Checkout' });
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click({ force: true });
  }

  // 2. 在 /checkout 頁面使用的按鈕
  async clickPlaceOrder() {
    const btn = this.page.locator('a[href="/payment"]');
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click({ force: true });
  }

  async fillPaymentAndConfirm(paymentInfo: Record<string, string>) {
    await this.nameOnCardInput.fill(paymentInfo.name);
    await this.cardNumberInput.fill(paymentInfo.number);
    await this.cvcInput.fill(paymentInfo.cvc);
    await this.expiryMonthInput.fill(paymentInfo.month);
    await this.expiryYearInput.fill(paymentInfo.year);
    await this.payAndConfirmBtn.click();
  }

  async verifyOrderPlaced() {
    await expect(this.successMessage).toBeVisible();
  }

  
}