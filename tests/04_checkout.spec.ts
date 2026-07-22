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

// 1. Make sure to go to the homepage or product page first.
  await page.goto('/products');
  // Handling GDPR pop-ups (if any)
  const consentBtn = page.locator('button:has-text("Consent"), button:has-text("AGREE")');
  if (await consentBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await consentBtn.click();
  }

  // 2. add to the cart
  await productsPage.addFirstProductToCart(); // Automatically entered /view_cart

  // 3. The first time you click "Proceed To Checkout" (while not logged in)
  await page.locator('a.check_out:has-text("Proceed To Checkout")').click({ force: true });

  // 4. Click "Register / Login" in Modal.
  await page.locator('#checkoutModal a[href="/login"]').click({ force: true });

  // 5. Register a new account
  await loginPage.startSignup(testUser.name, testUser.email);
  await signupPage.fillAccountDetails(testUser);
  await signupPage.verifyAccountCreated(); // Clicking Continue will take you back to /checkout or /view_cart

  // 6. Ensure you are on /cart or /checkout
  if (!page.url().includes('/checkout')) {
    await page.goto('/view_cart');
    await page.locator('a.check_out:has-text("Proceed To Checkout")').click({ force: true });
  }

  // 7. On the /checkout page, click "Place Order" (do not call proceedToCheckout again).
  await page.locator('a[href="/payment"]').click({ force: true });

  // 8. Fill out payment information
  await page.locator('input[name="name_on_card"]').fill('Test Card');
  await page.locator('input[name="card_number"]').fill('4111111111111111');
  await page.locator('input[name="cvc"]').fill('311');
  await page.locator('input[name="expiry_month"]').fill('12');
  await page.locator('input[name="expiry_year"]').fill('2028');

  // 9. Submit payment and verify
  await page.locator('button[data-qa="pay-button"]').click({ force: true });
  await expect(page.locator('h2[data-qa="order-placed"]')).toBeVisible({ timeout: 15000 });
});