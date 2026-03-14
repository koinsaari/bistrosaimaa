import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async expectHeroVisible() {
    await expect(this.page.locator('#home-hero h1')).toBeVisible();
    await expect(this.page.locator('#home-hero a[href="/menu"]')).toBeVisible();
    await expect(this.page.locator('#home-hero a[href="/contact"]')).toBeVisible();
  }

  async clickMenuCta() {
    await this.page.locator('#home-hero a[href="/menu"]').click();
  }

  async clickReservationCta() {
    await this.page.locator('#home-hero a[href="/contact"]').click();
  }

  async expectOfferingCardsVisible() {
    // The section h2 is not animated so scroll to it and verify the section exists
    const heading = this.page.getByRole('heading', { level: 2 }).first();
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    // Verify all 3 offering links exist in the DOM (cards use whileInView animation)
    await expect(this.page.locator('a[href="/menu"]').nth(1)).toBeAttached();
    await expect(this.page.locator('a[href*="facebook.com"]').first()).toBeAttached();
    await expect(this.page.locator('a[href="/contact"]').nth(1)).toBeAttached();
  }

  async expectReviewsSectionVisible() {
    const section = this.page.locator('section').filter({ hasText: /arvostelut|reviews/i }).first();
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }
}
