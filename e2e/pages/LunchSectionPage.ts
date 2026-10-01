import { Page, expect } from '@playwright/test';
import type { DayKey } from '../../src/lib/lunch';

export class LunchSectionPage {
  constructor(private page: Page) {}

  private day(day: DayKey) {
    return this.page.locator(`[data-testid="lunch-day-${day}"]`);
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async expectDayDishes(day: DayKey, names: string[]) {
    await this.day(day).scrollIntoViewIfNeeded();
    await expect(this.day(day).locator('[data-testid="lunch-dish"]')).toHaveText(names);
  }

  async expectNote(day: DayKey, text: string) {
    await expect(this.day(day).locator('[data-testid="lunch-note"]')).toHaveText(text);
  }

  async expectNoNote(day: DayKey) {
    await expect(this.day(day).locator('[data-testid="lunch-note"]')).toHaveCount(0);
  }

  async expectPlaceholder(day: DayKey) {
    await expect(this.day(day).locator('[data-testid="lunch-placeholder"]')).toBeVisible();
  }

  async expectFallback() {
    const fallback = this.page.locator('[data-testid="lunch-fallback"]');
    await fallback.scrollIntoViewIfNeeded();
    await expect(fallback).toBeVisible();
    await expect(this.page.locator('[data-testid^="lunch-day-"]')).toHaveCount(0);
  }
}
