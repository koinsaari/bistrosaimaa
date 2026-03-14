import { Page, expect } from '@playwright/test';

export class HomePage {
  private hero = this.page.locator('[data-testid="home-hero"]');
  private offerings = this.page.locator('[data-testid="home-offerings"]');
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

  async expectOfferingCardsVisible() {
    await this.offerings.scrollIntoViewIfNeeded();
    await expect(this.offerings.getByRole('heading', { level: 2 })).toBeVisible();
    // Cards use whileInView animation — verify they exist in the DOM
    await expect(this.page.locator('[data-testid="offering-card-menu"]')).toBeAttached();
    await expect(this.page.locator('[data-testid="offering-card-lunch"]')).toBeAttached();
    await expect(this.page.locator('[data-testid="offering-card-catering"]')).toBeAttached();
  }

  async expectReviewsSectionVisible() {
    await this.reviews.scrollIntoViewIfNeeded();
    await expect(this.reviews).toBeVisible();
  }
}
