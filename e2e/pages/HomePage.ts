import { Page, expect } from '@playwright/test';

export class HomePage {
  private hero = this.page.locator('[data-testid="home-hero"]');
  private placeStrip = this.page.locator('[data-testid="home-place-strip"]');
  private reviews = this.page.locator('[data-testid="home-reviews"]');

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async expectHeroVisible() {
    await expect(this.hero.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(this.hero.locator('a[href="/menu"]')).toBeVisible();
    await expect(this.hero.locator('a[href="/contact"]')).toBeVisible();
  }

  async clickMenuCta() {
    await this.hero.locator('a[href="/menu"]').click();
  }

  async clickReservationCta() {
    await this.hero.locator('a[href="/contact"]').click();
  }

  async expectCateringAndKabinettiVisible() {
    await this.placeStrip.scrollIntoViewIfNeeded();
    await expect(this.placeStrip.locator('[data-testid="place-strip-catering"]')).toBeVisible();
    await expect(this.placeStrip.locator('[data-testid="place-strip-kabinetti"]')).toBeVisible();
  }

  async expectCallCtaVisible() {
    await this.placeStrip.scrollIntoViewIfNeeded();
    await expect(this.placeStrip.locator('[data-testid="place-strip-call"]')).toHaveAttribute(
      'href',
      'tel:+358504499322',
    );
  }

  async clickQuoteCta() {
    await this.placeStrip.scrollIntoViewIfNeeded();
    await this.placeStrip.locator('[data-testid="place-strip-quote"]').click();
  }

  async expectReviewsSectionVisible() {
    await this.reviews.scrollIntoViewIfNeeded();
    await expect(this.reviews).toBeVisible();
  }
}
