import { test, expect } from '@playwright/test';
import { NavigationPage } from './pages/NavigationPage';

test.describe('Navigation', () => {
  test('nav links are visible', async ({ page }) => {
    await page.goto('/');
    await new NavigationPage(page).expectLinksVisible();
  });

  test('menu link navigates to /menu', async ({ page }) => {
    await page.goto('/');
    await new NavigationPage(page).clickMenu();
    await expect(page).toHaveURL('/menu');
  });

  test('gallery link navigates to /gallery', async ({ page }) => {
    await page.goto('/');
    await new NavigationPage(page).clickGallery();
    await expect(page).toHaveURL('/gallery');
  });

  test('contact link navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await new NavigationPage(page).clickContact();
    await expect(page).toHaveURL('/contact');
  });

  test('logo navigates back to home', async ({ page }) => {
    await page.goto('/menu');
    await new NavigationPage(page).clickLogo();
    await expect(page).toHaveURL('/');
  });
});
