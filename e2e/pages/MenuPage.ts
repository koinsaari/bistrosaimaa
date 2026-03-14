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
    const items = this.page.locator('[data-testid="menu-carousel-item"]');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBe(count);
  }

  async clickFirstImage() {
    await this.page.locator('[data-testid="menu-carousel-item"] img').first().click();
  }

  async expectFullscreenOverlayVisible() {
    await expect(this.page.locator('[data-testid="menu-fullscreen"]')).toBeVisible();
  }
}
