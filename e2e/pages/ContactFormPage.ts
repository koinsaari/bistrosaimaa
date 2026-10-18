import { Page, expect } from '@playwright/test';

export class ContactFormPage {
  private form = this.page.locator('form');
  private nameInput = this.page.locator('input[autocomplete="name"]');
  private emailInput = this.page.locator('input[type="email"]');
  private phoneInput = this.page.locator('input[type="tel"]');
  private messageInput = this.page.locator('textarea');
  private privacyCheckbox = this.page.getByRole('checkbox');
  private submitButton = this.page.locator('[data-testid="form-submit"]');
  private messageCounter = this.page.locator('span').filter({ hasText: /\/2000$/ });
  private honeypot = this.page.locator('input[name="field_x7q"]');

  constructor(private page: Page) {}

  async goto(path: '/contact' | '/en/contact' = '/contact') {
    await this.page.goto(path);
    // A click before React hydrates submits natively, so wait until the button has its handlers.
    await expect
      .poll(() => this.submitButton.evaluate((el) => Object.keys(el).some((k) => k.startsWith('__reactProps'))))
      .toBe(true);
  }

  async selectSubject(label: string) {
    await this.page.getByRole('combobox').click();
    await this.page.getByRole('option', { name: label, exact: true }).click();
  }

  /** Makes the server action request fail as if the network or the function broke. */
  async failServerAction() {
    await this.page.route('**/*', (route) =>
      route.request().method() === 'POST' && route.request().headers()['next-action']
        ? route.fulfill({ status: 500, body: 'Internal Server Error' })
        : route.fallback(),
    );
  }

  async expectErrorText(text: string) {
    await expect(this.page.locator('[data-testid="form-error"]')).toContainText(text);
  }

  async fillHoneypot(value: string) {
    await this.honeypot.fill(value, { force: true });
  }

  async fillName(value: string) {
    await this.nameInput.fill(value);
  }

  async fillEmail(value: string) {
    await this.emailInput.fill(value);
  }

  async fillPhone(value: string) {
    await this.phoneInput.fill(value);
  }

  async fillMessage(value: string) {
    await this.messageInput.fill(value);
  }

  async checkPrivacy() {
    await this.privacyCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async fillValidForm() {
    await this.fillName('Matti Meikäläinen');
    await this.fillEmail('matti@example.com');
    await this.fillMessage('kabinetit perjanataiksi kiitos');
    await this.checkPrivacy();
  }

  async expectFieldErrorsVisible(count: number) {
    await expect(this.page.locator('[data-slot="form-message"]')).toHaveCount(count);
  }

  async expectSuccessMessage() {
    await expect(this.page.locator('[data-testid="form-success"]')).toBeVisible();
  }

  async expectErrorMessage() {
    await expect(this.page.locator('[data-testid="form-error"]')).toBeVisible();
  }

  async expectMessageCounter(text: string) {
    await expect(this.messageCounter).toHaveText(text);
  }
}
