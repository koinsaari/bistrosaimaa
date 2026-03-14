import { test, expect } from '@playwright/test';
import { MobileNavigationPage } from './pages/MobileNavigationPage';

test.describe('Navigation (mobile)', () => {
  test('desktop nav is hidden on mobile', async ({ page }) => {
    await page.goto('/');
    await new MobileNavigationPage(page).expectDesktopNavHidden();
  });

  test('hamburger toggle opens the mobile menu', async ({ page }) => {
    await page.goto('/');
    await new MobileNavigationPage(page).openMenu();
  });

  test('menu link navigates to /menu', async ({ page }) => {
    await page.goto('/');
    await new MobileNavigationPage(page).clickMenu();
    await expect(page).toHaveURL('/menu');
  });

  test('gallery link navigates to /gallery', async ({ page }) => {
    await page.goto('/');
    await new MobileNavigationPage(page).clickGallery();
    await expect(page).toHaveURL('/gallery');
  });

  test('contact link navigates to /contact', async ({ page }) => {
    await page.goto('/');
    await new MobileNavigationPage(page).clickContact();
    await expect(page).toHaveURL('/contact');
  });

  test('logo navigates back to home', async ({ page }) => {
    await page.goto('/menu');
    await new MobileNavigationPage(page).clickLogo();
    await expect(page).toHaveURL('/');
  });
});
