import { defineConfig, devices } from '@playwright/test';
import { ConfigOptions } from './src/ConfigOptions';

const defaultAppURL = 'http://localhost:8011';
const appURL = process.env['APP_URL'] ?? defaultAppURL;
const defaultCommand = appURL === defaultAppURL ? 'docker compose up --pull=always --quiet-pull' : 'sleep 999d';

export default defineConfig<ConfigOptions>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 120000,
  expect: {
    timeout: 30_000,
  },
  retries: 0,
  workers: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? [
    ['html'],
    ['github'],
  ] : 'html',
  use: {
    shopware: {
      appURL: appURL,
      mailpitBaseURL: process.env['SHOPWARE_MAILPIT_BASE_URL'] || 'http://localhost:8013',
    },
    trace: 'retain-on-failure',
    video: 'off',
  },
  // We abuse this to wait for the external webserver
  webServer: {
    command: process.env['WEBSERVER_COMMAND'] ?? defaultCommand,
    url: appURL,
    reuseExistingServer: true,
    timeout: 180000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});