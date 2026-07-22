import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchBtn: Locator;
  readonly searchedProductsHeader: Locator;
  readonly productItems: Locator;
  //readonly firstProductAddToCartBtn: Locator;
  readonly viewCartBtn: Locator;
  readonly viewCartLink: Locator;
  readonly addFirstProductBtn: Locator;
  readonly viewCartModalLink: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchBtn = page.locator('#submit_search');
    this.searchedProductsHeader = page.locator('h2.title.text-center');
    this.productItems = page.locator('.product-image-wrapper');
    this.addFirstProductBtn = page.locator('.product-overlay .add-to-cart').first();
    this.viewCartBtn = page.getByRole('link', { name: 'View Cart' });
    

    //Locate the "View Cart" link/button in the pop-up window.
    this.viewCartLink = page.locator('u:has-text("View Cart")');

    //Lock the "Add to cart" button (not overlay) within the regular product card.
    this.addFirstProductBtn = page.locator('.productinfo .add-to-cart').first();
    
    //Locate the "View Cart" link in the Modal.
    this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]'); 
  }

  async searchProduct(keyword: string) {
    await this.dismissConsentModal();
    await this.searchInput.fill(keyword);
    await this.searchBtn.click({ force: true });
  }

  async verifySearchResults(keyword: string) {
    await expect(this.searchedProductsHeader).toContainText('Searched Products');
    const count = await this.productItems.count();
    expect(count).toBeGreaterThan(0);
  }


  /*
  async addFirstProductToCart() {
    await this.productItems.first().hover();
    await this.firstProductAddToCartBtn.click();
    await this.viewCartBtn.click();
  }
  */

  async addFirstProductToCart() {
    // 1. Find the first item and move the mouse over it (Trigger overlay)
    const firstProduct = this.page.locator('.single-products').first();
    await firstProduct.hover();

    // 2. Click the "Add to cart" button
    await firstProduct.locator('a.add-to-cart').first().click({ force: true });

    // 3. Wait for #cartModal to appear and become visible!
    const cartModal = this.page.locator('#cartModal');
    await expect(cartModal).toBeVisible({ timeout: 10000 });

    // 4. Wait until the View Cart link becomes clickable before clicking it.
    const viewCartLink = cartModal.locator('a[href="/view_cart"]');
    await viewCartLink.waitFor({ state: 'visible' });
    await viewCartLink.click();
  }

  async dismissConsentModal() {
  try {
    const consentBtn = this.page.locator('.fc-consent-root button:has-text("Consent"), .fc-consent-root button:has-text("AGREE")');
    if (await consentBtn.isVisible({ timeout: 2000 })) {
      await consentBtn.click();
    }
  } catch {
    //If no pop-up appears, skip silently.
  }
}
}