import { test } from '@playwright/test';
import { ContactFormPage } from './pages/ContactFormPage';

test.describe('Contact Form', () => {
  test.describe('Validation', () => {
    test('empty submission shows 4 required field errors', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.submit();
      await form.expectFieldErrorsVisible(4);
    });

    test('invalid email shows a field error', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillEmail('missing-dot@nodomain');
      await form.submit();
      // name, email (invalid), message, privacy = 4 errors
      await form.expectFieldErrorsVisible(4);
    });

    test('name with only numbers shows a field error', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillName('12345');
      await form.submit();
      // name (invalid), email, message, privacy = 4 errors
      await form.expectFieldErrorsVisible(4);
    });

    test('invalid phone shows a field error', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillPhone('abc-invalid');
      await form.submit();
      // name, email, message, phone (invalid), privacy = 5 errors
      await form.expectFieldErrorsVisible(5);
    });

    test('all fields valid except privacy shows 1 error', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillName('Matti Meikäläinen');
      await form.fillEmail('matti@example.com');
      await form.fillMessage('Testviesti');
      await form.submit();
      await form.expectFieldErrorsVisible(1);
    });

    test('message counter updates as you type', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillMessage('Hello');
      await form.expectMessageCounter('5/1000');
    });
  });

  test.describe('Submission', () => {
    test('successful submission shows success banner', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.mockApiSuccess();
      await form.goto();
      await form.fillValidForm();
      await form.submit();
      await form.expectSuccessMessage();
    });

    test('failed API response shows error banner', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.mockApiError();
      await form.goto();
      await form.fillValidForm();
      await form.submit();
      await form.expectErrorMessage();
    });
  });
});
