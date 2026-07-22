import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductsPage } from '../pages/ProductsPage';

test('Journey 3: Search Product and verify results', async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);

  await homePage.navigateTo();
  await homePage.clickProducts();

  await productsPage.searchProduct('Dress');
  await productsPage.verifySearchResults('Dress');
});