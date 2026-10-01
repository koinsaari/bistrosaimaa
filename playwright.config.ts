import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// Local runs hit the Neon ci branch (fixture data), not .env.local's dev branch. CI sets DATABASE_URL itself.
if (!process.env.DATABASE_URL && existsSync('.env.e2e')) {
  process.loadEnvFile('.env.e2e');
}

// Own port so a running `npm run dev` (dev DB) is never reused.
const PORT = 3100;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
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
      testIgnore: ['**/navigation-mobile.spec.ts'],
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testIgnore: ['**/navigation.spec.ts'],
    },
  ],

  webServer: {
    command: `${process.env.CI ? 'npm run start' : 'npm run dev'} -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
