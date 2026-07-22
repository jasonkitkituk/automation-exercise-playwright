import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test('Journey 4: Place Order (Login during checkout flow)', async ({ page }) => {
  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const checkoutPage = new CheckoutPage(page);

  await homePage.navigateTo();
  
  // 1. 先進入商品頁加購物車
  await homePage.clickProducts();
  await productsPage.addFirstProductToCart();

  // 2. 進行結帳
  await checkoutPage.proceedToCheckout();

  // 3. 登入（如未登入會引導登入）
  await homePage.clickSignupLogin();
  await loginPage.login('qa_automation_test@example.com', 'Password123!');

  // 4. 回購物車完成結帳
  await homePage.clickCart();
  await checkoutPage.proceedToCheckout();
  await checkoutPage.placeOrder();

  // 5. 填寫信用卡付款
  await checkoutPage.fillPaymentAndConfirm({
    name: 'Test QA',
    number: '4111111111111111',
    cvc: '123',
    month: '12',
    year: '2028',
  });

  // 6. 驗證訂單完成
  await checkoutPage.verifyOrderPlaced();
});