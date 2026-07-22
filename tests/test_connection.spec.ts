import { test, expect } from '@playwright/test';

test('Simple Navigation Test', async ({ page }) => {
  await page.goto('https://automationexercise.com/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(/Automation Exercise/);
});