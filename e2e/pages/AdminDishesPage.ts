import { Locator, Page, expect } from '@playwright/test';

export class AdminDishesPage {
  private newName = this.page.getByTestId('category-new-name');
  private newOrder = this.page.getByTestId('category-new-order');
  private addButton = this.page.getByTestId('category-add');
  private addError = this.page.getByTestId('category-add-error');

  constructor(private page: Page) {}

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
}
