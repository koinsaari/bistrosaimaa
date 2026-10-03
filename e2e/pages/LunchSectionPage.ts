import { Page, expect } from '@playwright/test';
import type { DayKey } from '../../src/lib/lunch';

const helsinkiDayMonth = (date: Date) => {
  const parts = new Intl.DateTimeFormat('fi-FI', { timeZone: 'Europe/Helsinki', day: 'numeric', month: 'numeric' }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get('day')}.${get('month')}.`;
};
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class LunchSectionPage {
  private createdAt = new Date();

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

  async expectDishNowhere(name: string) {
    await expect(this.page.locator('[data-testid="lunch-dish"]', { hasText: name })).toHaveCount(0);
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

  /**
   * The public "Päivitetty d.m." line, which must show today once a week has just been saved. A run can cross
   * midnight (Helsinki) between the page object being created and this check, so either day counts.
   */
  async expectUpdatedToday() {
    const days = new Set([this.createdAt, new Date()].map(helsinkiDayMonth));
    await expect(this.page.getByTestId('lunch-updated')).toHaveText(new RegExp(`(?:^|\\D)(?:${[...days].map(escapeRegExp).join('|')})`));
  }
}
