import { test } from '@playwright/test';
import { FooterPage } from './pages/FooterPage';

test.describe('Footer', () => {
  test('shows brand, address and contact links', async ({ page }) => {
    await page.goto('/');
    await new FooterPage(page).expectContentVisible();
  });

  test('has privacy policy link', async ({ page }) => {
    await page.goto('/');
    await new FooterPage(page).expectPrivacyLinkVisible();
  });

  test('has Facebook link', async ({ page }) => {
    await page.goto('/');
    await new FooterPage(page).expectFacebookLinkVisible();
  });

  test('shows copyright', async ({ page }) => {
    await page.goto('/');
    await new FooterPage(page).expectCopyrightVisible();
  });
});
