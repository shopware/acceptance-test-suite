import { defineConfig, devices } from '@playwright/test';

process.env['SHOPWARE_ADMIN_USERNAME'] = process.env['SHOPWARE_ADMIN_USERNAME'] || 'admin';
process.env['SHOPWARE_ADMIN_PASSWORD'] = process.env['SHOPWARE_ADMIN_PASSWORD'] || 'shopware';

process.env['APP_URL'] = process.env['APP_URL'] ?? 'http://localhost:8000';

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
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: 'html',
  use: {
    baseURL: process.env['APP_URL'],
    trace: 'on',
    video: 'off',
  },
  // We abuse this to wait for the external webserver
  webServer: {
    command: 'docker compose up',
    url: process.env['APP_URL'],
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});