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
    

    // 定位彈窗中的 "View Cart" 連結/按鈕
    this.viewCartLink = page.locator('u:has-text("View Cart")');

    // 鎖定一般商品卡片內的 "Add to cart" 按鈕（非 overlay）
    this.addFirstProductBtn = page.locator('.productinfo .add-to-cart').first();
    
    // 定位 Modal 裡面的 "View Cart" 連結
    this.viewCartModalLink = page.locator('#cartModal a[href="/view_cart"]'); 
  }

  async searchProduct(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchBtn.click();
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
    // 1. 確保第一個商品的 Add to cart 按鈕已可點擊並執行點擊
    await this.addFirstProductBtn.scrollIntoViewIfNeeded();
    await this.addFirstProductBtn.click({ force: true });

    // 2. 等待 Modal 載入至 DOM（不需要判定 opacity/visible，避開 CSS 動畫影響）
    await this.viewCartModalLink.waitFor({ state: 'attached', timeout: 15000 });

    // 3. 強制點擊 View Cart 進入購物車頁面
    await this.viewCartModalLink.click({ force: true });
  }
}