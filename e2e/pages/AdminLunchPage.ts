import { Locator, Page, expect } from '@playwright/test';

type WeekRef = { isoYear: number; isoWeek: number };

export class AdminLunchPage {
  private weekSelect = this.page.getByTestId('week-select');
  private saveButton = this.page.getByTestId('week-save');
  private publishButton = this.page.getByTestId('week-publish');

  constructor(private page: Page) {}

  private day(day: number): Locator {
    return this.page.getByTestId(`day-${day}`);
  }

  private editor(): Locator {
    return this.page.getByTestId('day-editor');
  }

  private dishRow(name: string): Locator {
    return this.editor().getByTestId('day-dish').filter({ has: this.page.getByText(name, { exact: true }) });
  }

  private async inEditor<T>(day: number, fn: () => Promise<T>): Promise<T> {
    await expect(async () => {
      await this.day(day).click({ timeout: 1000 });
      await expect(this.editor()).toBeVisible({ timeout: 1000 });
    }).toPass();
    const result = await fn();
    await this.page.getByTestId('day-done').click();
    await expect(this.editor()).toHaveCount(0);
    return result;
  }

  private option(name: string): Locator {
    return this.page.getByRole('option', { name, exact: true });
  }

  async goto(week?: WeekRef) {
    await this.page.goto(week ? `/admin/lunch?year=${week.isoYear}&week=${week.isoWeek}` : '/admin/lunch');
    await expect(this.weekSelect).toBeVisible();
  }

  /** True when the week open on the page has been saved before. */
  async isStored() {
    await expect(this.page.getByTestId('week-status')).toHaveText(/./);
    return (await this.page.getByTestId('week-status').textContent()) !== 'Ei tallennettu';
  }

  async selectWeek(label: string) {
    await this.weekSelect.click();
    await this.option(label).click();
  }

  async addDish(day: number, name: string) {
    await this.inEditor(day, async () => {
      await this.editor().getByTestId('day-add').click();
      await this.option(name).click();
    });
  }

  async moveDishUp(day: number, name: string) {
    await this.inEditor(day, () => this.dishRow(name).getByTestId('dish-up').click());
  }

  async removeDish(day: number, name: string) {
    await this.inEditor(day, () => this.dishRow(name).getByTestId('dish-remove').click());
  }

  async setNote(day: number, note: string) {
    await this.inEditor(day, () => this.editor().getByTestId('day-note').fill(note));
  }

  async save() {
    await this.saveButton.click();
  }

  async publish() {
    await this.publishButton.click();
  }

  async expectSaved() {
    await expect(this.page.getByTestId('week-saved')).toBeVisible();
  }

  async expectNotShownAsSaved() {
    await expect(this.page.getByTestId('week-saved')).toHaveCount(0);
  }

  async expectError(message: string) {
    await expect(this.page.getByTestId('week-error')).toHaveText(message);
  }

  async expectDayDishes(day: number, names: string[]) {
    await expect(this.day(day).getByTestId('day-dish-name')).toHaveText(names);
  }

  async expectRetiredBadge(day: number, name: string) {
    await this.inEditor(day, () => expect(this.dishRow(name).getByText('Poistettu käytöstä')).toBeVisible());
  }

  async expectNote(day: number, note: string) {
    await this.inEditor(day, () => expect(this.editor().getByTestId('day-note')).toHaveValue(note));
  }

  async expectStatus(status: 'Ei tallennettu' | 'Ei julkaistu' | 'Julkaistu') {
    await expect(this.page.getByTestId('week-status')).toHaveText(status);
  }

  async expectPublishButton(label: 'Julkaise' | 'Piilota', enabled: boolean) {
    await expect(this.publishButton).toHaveText(label);
    await (enabled ? expect(this.publishButton).toBeEnabled() : expect(this.publishButton).toBeDisabled());
  }

  async expectSelectedWeek(label: string) {
    await expect(this.weekSelect).toHaveText(label);
  }

  /** Opens the add-dish picker and checks which dishes it offers. */
  async expectPickerOffers(day: number, name: string, offered: boolean) {
    await this.inEditor(day, async () => {
      await this.editor().getByTestId('day-add').click();
      await expect(this.option(name)).toHaveCount(offered ? 1 : 0);
      await this.page.keyboard.press('Escape');
    });
  }

  async expectUnsavedHint(visible: boolean) {
    await expect(this.page.getByTestId('week-dirty')).toHaveCount(visible ? 1 : 0);
  }
}
