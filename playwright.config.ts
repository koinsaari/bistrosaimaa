import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Local runs hit the Neon ci branch (fixture data), not .env.local's dev branch. CI sets DATABASE_URL itself.
if (!process.env.DATABASE_URL && existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

// The contact form never sends real mail from tests.
process.env.CONTACT_MAIL_TRANSPORT = 'log';

// The Telegram bot runs with a scripted model and sends nothing to Telegram; the webhook secret and user id are throwaway.
process.env.TELEGRAM_BOT_TOKEN = 'e2e-token';
process.env.TELEGRAM_WEBHOOK_SECRET = 'e2e-secret';
process.env.TELEGRAM_ALLOWED_USER_IDS = '1001';
process.env.BOT_MODEL = 'fixture';
process.env.TELEGRAM_TRANSPORT = 'log';

// Own port so a running `npm run dev` (dev DB) is never reused.
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['github'], ['html', { open: 'never' }]] : 'html',
  timeout: 30_000,

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/navigation-mobile.spec.ts', '**/bot*.spec.ts'],
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testIgnore: ['**/navigation.spec.ts', '**/bot*.spec.ts'],
    },
    // The bot specs edit the shown lunch week that the public specs read, so they run alone after both, one file at a time (`workers: 1`).
    {
      name: 'bot',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/bot*.spec.ts',
      dependencies: ['desktop', 'mobile'],
      fullyParallel: false,
      workers: 1,
    },
  ],

  webServer: {
    command: `${process.env.CI ? 'npm run start' : 'npm run dev'} -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
