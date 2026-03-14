import { test } from '@playwright/test';
import { MenuPage } from './pages/MenuPage';

test.describe('Menu Page', () => {
  test('title and subtitle are visible', async ({ page }) => {
    const menu = new MenuPage(page);
    await menu.goto();
    await menu.expectTitleVisible();
  });

  test('carousel shows 6 menu images', async ({ page }) => {
    const menu = new MenuPage(page);
    await menu.goto();
    await menu.expectCarouselImages(6);
  });

  test('clicking an image opens the fullscreen overlay', async ({ page }) => {
    const menu = new MenuPage(page);
    await menu.goto();
    await menu.clickFirstImage();
    await menu.expectFullscreenOverlayVisible();
  });
});
