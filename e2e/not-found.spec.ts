import { test, expect } from '@playwright/test';
import { NotFoundPage } from './pages/NotFoundPage';

test.describe('404 Page', () => {
  test('shows 404 heading', async ({ page }) => {
    const notFound = new NotFoundPage(page);
    await notFound.goto();
    await notFound.expect404Visible();
  });

  test('back to home navigates to /', async ({ page }) => {
    const notFound = new NotFoundPage(page);
    await notFound.goto();
    await notFound.clickBackToHome();
    await expect(page).toHaveURL('/');
  });
});
