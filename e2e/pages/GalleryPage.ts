import { Page, expect } from '@playwright/test';

export class GalleryPage {
  private dialog = this.page.locator('[role="dialog"]');
  private images = this.page.locator('[data-testid="gallery-image"]');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/gallery');
  }

  async expectTitleVisible() {
    await expect(this.page.locator('#gallery-hero h1')).toBeVisible();
  }

  async expectImageCount(count: number) {
    await expect(this.images.first()).toBeVisible();
    await expect(this.images).toHaveCount(count);
  }

  async clickCategory(name: string) {
    await this.page.getByRole('button', { name, exact: true }).click();
    await this.page.waitForTimeout(400);
  }

  async openImage(index = 0) {
    await this.images.nth(index).click();
    await expect(this.dialog).toBeVisible();
  }

  async expectLightboxCounter(text: string) {
    await expect(this.dialog.locator('[data-testid="lightbox-counter"]')).toHaveText(text);
  }

  async clickLightboxNext() {
    await this.dialog.locator('[data-testid="lightbox-next"]').click();
  }

  async closeLightboxWithEscape() {
    await this.page.keyboard.press('Escape');
    await expect(this.dialog).toBeHidden();
  }
}
