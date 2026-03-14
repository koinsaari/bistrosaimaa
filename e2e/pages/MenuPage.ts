import { Page, expect } from '@playwright/test';

export class MenuPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/menu');
  }

  async expectTitleVisible() {
    await expect(this.page.locator('#menu-hero h1')).toBeVisible();
    await expect(this.page.locator('#menu-hero p')).toBeVisible();
  }

  async expectCarouselImages(count: number) {
    const images = this.page.locator('[data-slot="carousel-item"] img');
    await expect(images.first()).toBeVisible();
    expect(await images.count()).toBe(count);
  }

  async clickFirstImage() {
    await this.page.locator('[data-slot="carousel-item"] img').first().click();
  }

  async expectFullscreenOverlayVisible() {
    await expect(this.page.locator('.fixed.inset-0.z-50')).toBeVisible();
  }
}
