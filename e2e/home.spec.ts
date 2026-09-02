import { test, expect } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home Page', () => {
  test('hero section is visible', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectHeroVisible();
  });

  test('menu CTA navigates to /menu', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickMenuCta();
    await expect(page).toHaveURL('/menu');
  });

  test('reservation CTA navigates to /contact', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickReservationCta();
    await expect(page).toHaveURL('/contact');
  });

  test('offerings section shows 3 cards', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectOfferingCardsVisible();
  });

  test('place strip call button has correct tel link', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectCallCtaVisible();
  });

  test('place strip quote CTA navigates to /contact', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickQuoteCta();
    await expect(page).toHaveURL('/contact');
  });

  test('reviews section is visible', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectReviewsSectionVisible();
  });
});
