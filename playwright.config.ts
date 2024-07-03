import { defineConfig, devices } from '@playwright/test';

process.env['SHOPWARE_ADMIN_USERNAME'] = process.env['SHOPWARE_ADMIN_USERNAME'] || 'admin';
process.env['SHOPWARE_ADMIN_PASSWORD'] = process.env['SHOPWARE_ADMIN_PASSWORD'] || 'shopware';
process.env['MAILPIT_BASE_URL'] = process.env['MAILPIT_BASE_URL'] || 'http://localhost:8013';

const defaultAppUrl = 'http://localhost:8011/';
process.env['APP_URL'] = process.env['APP_URL'] ?? defaultAppUrl;

// make sure APP_URL ends with a slash
process.env['APP_URL'] = (process.env['APP_URL'] ?? '').replace(/\/+$/, '') + '/';
if (process.env['ADMIN_URL']) {
  process.env['ADMIN_URL'] = process.env['ADMIN_URL'].replace(/\/+$/, '') + '/';
} else {
  process.env['ADMIN_URL'] = process.env['APP_URL'] + 'admin/';
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  timeout: 60000,
  retries: 0,
  workers: process.env.CI ? 2 : 1,
  reporter: process.env.CI ? [
    ['html'],
    ['github'],
  ] : 'html',
  use: {
    baseURL: process.env['APP_URL'],
    trace: 'retain-on-failure',
    video: 'off',
  },
  // We abuse this to wait for the external webserver
  webServer: {
    command: process.env['APP_URL'] === defaultAppUrl ? 'docker compose up --pull=always --quiet-pull shopware' : 'sleep 1h',
    url: process.env['APP_URL'],
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