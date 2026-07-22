import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('Journey 4: Place Order (Login during checkout flow)', async ({ page }) => {
const loginPage = new LoginPage(page);
  const signupPage = new SignupPage(page);
  const productsPage = new ProductsPage(page);
  const checkoutPage = new CheckoutPage(page);

  const timestamp = Date.now();
  const testUser = {
    name: 'Test User',
    email: `testuser_${timestamp}@example.com`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test Street',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobile: '1234567890',
  };

// 1. 確保先前往首頁或產品頁
  await page.goto('/products');
  // 處理 GDPR 彈窗 (若有)
  const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
  if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await consentBtn.click();
  }

  // 2. 加入購物車
 await productsPage.addFirstProductToCart(); // 已自動進入 /view_cart

  // 2. 第一次點擊 Proceed To Checkout (未登入狀態)
  await page.locator('a.check_out:has-text("Proceed To Checkout")').click({ force: true });

  // 3. 點擊 Modal 中的 "Register / Login"
  await page.locator('#checkoutModal a[href="/login"]').click({ force: true });

  // 4. 註冊新帳號
  await loginPage.startSignup(testUser.name, testUser.email);
  await signupPage.fillAccountDetails(testUser);
  await signupPage.verifyAccountCreated(); // 點擊 Continue 後會回到 /checkout 或 /view_cart

  // 5. 確保進入 /cart 或 /checkout
  if (!page.url().includes('/checkout')) {
    await page.goto('/view_cart');
    await page.locator('a.check_out:has-text("Proceed To Checkout")').click({ force: true });
  }

  // 6. 此時在 /checkout 頁面，直接點擊 "Place Order" (不要再呼叫 proceedToCheckout)
  await page.locator('a[href="/payment"]').click({ force: true });

  // 7. 填寫付款資訊
  await page.locator('input[name="name_on_card"]').fill('Test Card');
  await page.locator('input[name="card_number"]').fill('4111111111111111');
  await page.locator('input[name="cvc"]').fill('311');
  await page.locator('input[name="expiry_month"]').fill('12');
  await page.locator('input[name="expiry_year"]').fill('2028');

  // 8. 提交付款並驗證
  await page.locator('button[data-qa="pay-button"]').click({ force: true });
  await expect(page.locator('h2[data-qa="order-placed"]')).toBeVisible({ timeout: 15000 });
});