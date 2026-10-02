import { Locator, Page, expect } from '@playwright/test';

export class AdminDishesPage {
  private newName = this.page.getByTestId('category-new-name');
  private newOrder = this.page.getByTestId('category-new-order');
  private addButton = this.page.getByTestId('category-add');
  private addError = this.page.getByTestId('category-add-error');

  private dialog = this.page.getByRole('dialog');
  private dishError = this.dialog.getByTestId('dish-error');

  constructor(private page: Page) {}

  private dishRow(name: string): Locator {
    return this.page.locator(`[data-testid="dish-row"][data-dish="${name}"]`);
  }

  private async pick(trigger: Locator, option: string) {
    await trigger.click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }

  private row(name: string): Locator {
    return this.page.locator(`[data-testid="category-row"][data-category="${name}"]`);
  }

  async goto() {
    await this.page.goto('/admin/dishes');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/\/admin\/dishes$/);
    await expect(this.page.getByRole('heading', { name: 'Ruoat' })).toBeVisible();
  }

  async addCategory(name: string, sortOrder: string) {
    await this.newName.fill(name);
    await this.newOrder.fill(sortOrder);
    await this.addButton.click();
  }

  async editCategory(name: string, next: { name: string; sortOrder: string }) {
    const row = this.row(name);
    await row.getByTestId('category-name').fill(next.name);
    await row.getByTestId('category-order').fill(next.sortOrder);
    await row.getByTestId('category-save').click();
  }

  async deleteCategory(name: string) {
    await this.row(name).getByTestId('category-delete').click();
    await this.dialog.getByTestId('category-delete-confirm').click();
  }

  async cancelCategoryDelete(name: string) {
    await this.row(name).getByTestId('category-delete').click();
    await this.dialog.getByRole('button', { name: 'Peruuta' }).click();
    await expect(this.dialog).toHaveCount(0);
  }

  async expectCategory(name: string, sortOrder: string) {
    const row = this.row(name);
    await expect(row).toBeVisible();
    await expect(row.getByTestId('category-order')).toHaveValue(sortOrder);
  }

  async expectNoCategory(name: string) {
    await expect(this.row(name)).toHaveCount(0);
  }

  async expectAddError(message: string, typedName: string) {
    await expect(this.addError).toHaveText(message);
    await expect(this.newName).toHaveValue(typedName);
  }

  async expectRowError(name: string, message: string) {
    await expect(this.row(name).getByTestId('category-error')).toHaveText(message);
  }

  async openNewDish() {
    await this.page.getByTestId('dish-add').click();
  }

  async openEditDish(name: string) {
    await this.dishRow(name).getByTestId('dish-edit').click();
  }

  async fillDish(fields: { name?: string; description?: string; category?: string; allergens?: string[] }) {
    if (fields.name !== undefined) await this.dialog.getByTestId('dish-name').fill(fields.name);
    if (fields.description !== undefined) await this.dialog.getByTestId('dish-description').fill(fields.description);
    if (fields.category !== undefined) await this.pick(this.dialog.getByTestId('dish-category'), fields.category);
    for (const allergen of fields.allergens ?? []) {
      await this.dialog.getByTestId(`dish-allergen-${allergen}`).click();
    }
  }

  async saveDish() {
    await this.dialog.getByTestId('dish-save').click();
  }

  async addDish(fields: { name: string; description?: string; category?: string; allergens?: string[] }) {
    await this.openNewDish();
    await this.fillDish(fields);
    await this.saveDish();
  }

  async duplicateDish(name: string) {
    await this.dishRow(name).getByTestId('dish-duplicate').click();
  }

  async toggleDishActive(name: string) {
    await this.dishRow(name).getByTestId('dish-toggle-active').click();
  }

  async searchDishes(query: string) {
    await this.page.getByTestId('dish-search').fill(query);
  }

  async filterStatus(status: 'Käytössä' | 'Poistettu käytöstä' | 'Kaikki') {
    await this.pick(this.page.getByTestId('dish-filter-status'), status);
  }

  async filterCategory(category: string) {
    await this.pick(this.page.getByTestId('dish-filter-category'), category);
  }

  async expectDish(name: string, expected: { category?: string; allergens?: string; retired?: boolean } = {}) {
    const row = this.dishRow(name);
    await expect(row).toBeVisible();
    if (expected.category !== undefined) await expect(row.getByRole('cell').nth(1)).toHaveText(expected.category);
    if (expected.allergens !== undefined) await expect(row.getByRole('cell').nth(2)).toHaveText(expected.allergens);
    if (expected.retired !== undefined) {
      await expect(row.getByText('Poistettu käytöstä')).toHaveCount(expected.retired ? 1 : 0);
    }
  }

  async expectNoDish(name: string) {
    await expect(this.dishRow(name)).toHaveCount(0);
  }

  async expectDishFormClosed() {
    await expect(this.dialog).toHaveCount(0);
  }

  async expectDishError(message: string, typedName: string) {
    await expect(this.dishError).toHaveText(message);
    await expect(this.dialog.getByTestId('dish-name')).toHaveValue(typedName);
  }

  async expectDishFormCategory(category: string) {
    await expect(this.dialog.getByTestId('dish-category')).toHaveText(category);
  }

  async closeDishForm() {
    await this.page.keyboard.press('Escape');
    await this.expectDishFormClosed();
  }
}
