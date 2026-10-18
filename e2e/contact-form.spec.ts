import { expect, test } from '@playwright/test';
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

    test('a company name with digits and punctuation is accepted', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillName('Yritys Oy 2.0');
      await form.submit();
      // email, message, privacy = 3 errors
      await form.expectFieldErrorsVisible(3);
    });

    test('invalid phone shows a field error', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillPhone('123 456 7890');
      await form.submit();
      // name, email, phone (invalid), message, privacy = 5 errors
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
      await form.expectMessageCounter('5/2000');
    });
  });

  test.describe('Submission', () => {
    test('a valid message is sent and the form is cleared', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillValidForm();
      await form.fillPhone('040 123 4567');
      await form.selectSubject('Pitopalvelut');
      await form.submit();
      await form.expectSuccessMessage();
      await form.expectMessageCounter('0/2000');
    });

    test('a failed send shows the error banner with the phone number and email', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.failServerAction();
      await form.fillValidForm();
      await form.submit();
      await form.expectErrorMessage();
      await form.expectErrorText('+358 50 4499 322');
      await form.expectErrorText('bistrosaimaa@gmail.com');
    });

    test('a filled honeypot looks like a normal send to the bot', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillValidForm();
      await form.fillHoneypot('https://spam.example');
      await form.submit();
      await form.expectSuccessMessage();
    });

    test('the success banner goes away once a new message is typed', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto();
      await form.fillValidForm();
      await form.submit();
      await form.expectSuccessMessage();
      await form.fillMessage('Toinen viesti');
      await expect(page.locator('[data-testid="form-success"]')).toHaveCount(0);
    });

    test('the English form sends too', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto('/en/contact');
      await form.fillValidForm();
      await form.selectSubject('Event Room Reservation');
      await form.submit();
      await form.expectSuccessMessage();
    });

    test('the privacy link stays in the current language', async ({ page }) => {
      const form = new ContactFormPage(page);
      await form.goto('/en/contact');
      await expect(page.locator('form a[href$="/privacy"]')).toHaveAttribute('href', '/en/privacy');
    });
  });
});
