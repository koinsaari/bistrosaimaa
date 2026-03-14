import { test } from '@playwright/test';
import { ContactPage } from './pages/ContactPage';

test.describe('Contact Page', () => {
  test('title is visible', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.expectTitleVisible();
  });

  test('shows address, phone and email', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.expectContactInfoVisible();
  });

  test('has a Google Maps link', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.expectMapsLinkVisible();
  });

  test('has a Facebook link', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.expectFacebookLinkVisible();
  });

  test('contact form is present', async ({ page }) => {
    const contact = new ContactPage(page);
    await contact.goto();
    await contact.expectFormVisible();
  });
});
