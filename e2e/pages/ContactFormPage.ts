import { Page, expect } from '@playwright/test';

export class ContactFormPage {
  private form = this.page.locator('form');
  private nameInput = this.page.locator('input[placeholder="Nimi"]');
  private emailInput = this.page.locator('input[type="email"]');
  private phoneInput = this.page.locator('input[type="tel"]');
  private messageInput = this.page.locator('textarea');
  private privacyCheckbox = this.page.locator('input[type="checkbox"]');
  private submitButton = this.page.locator('[data-testid="form-submit"]');
  private messageCounter = this.page.locator('span').filter({ hasText: /\/1000/ });

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/contact');
  }

  async mockApiSuccess() {
    await this.page.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    );
  }

  async mockApiError() {
    await this.page.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Server error' }),
      })
    );
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
