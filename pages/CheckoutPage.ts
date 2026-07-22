import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly proceedToCheckoutBtn: Locator;
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

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click();
  }

  async placeOrder() {
    await this.placeOrderBtn.click();
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