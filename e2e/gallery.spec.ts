import { test } from '@playwright/test';
import { GalleryPage } from './pages/GalleryPage';

test.describe('Gallery Page', () => {
  test('title is visible', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.expectTitleVisible();
  });

  test('shows all 40 images by default', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.expectImageCount(40);
  });

  test('food filter shows 6 images', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.clickCategory('Ruoka');
    await gallery.expectImageCount(6);
  });

  test('"Kaikki" restores all images', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.clickCategory('Ruoka');
    await gallery.clickCategory('Kaikki');
    await gallery.expectImageCount(40);
  });

  test('clicking an image opens the lightbox', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.openImage();
    await gallery.expectLightboxCounter('1 / 40');
  });

  test('lightbox next button advances to image 2', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.openImage();
    await gallery.clickLightboxNext();
    await gallery.expectLightboxCounter('2 / 40');
  });

  test('Escape closes the lightbox', async ({ page }) => {
    const gallery = new GalleryPage(page);
    await gallery.goto();
    await gallery.openImage();
    await gallery.closeLightboxWithEscape();
  });
});
