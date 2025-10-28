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
if (process.env['ADMIN_API_URL']) {
    process.env['ADMIN_API_URL'] = (process.env['ADMIN_API_URL'] ?? '').replace(/\/+$/, '') + '/';
}
if (!process.env['WEBSERVER_COMMAND']) {
    if (process.env['APP_URL'] === defaultAppUrl) {
        process.env['WEBSERVER_COMMAND'] = 'docker compose up --pull=always --quiet-pull';
    } else {
        process.env['WEBSERVER_COMMAND'] = 'sleep 999d';
    }
}
// Determine locale from environment
const envLang = process.env.LANG || process.env.LANGUAGE || process.env.lang || 'en-GB';
const browserLocale = envLang.startsWith('de') ? 'de-DE' : 'en-GB';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    timeout: 120000,
    expect: {
        timeout: 30_000,
    },
    retries: 0,
    workers: process.env.CI ? 2 : 1,
    reporter: process.env.CI ? [['html'], ['github']] : 'html',
    use: {
        baseURL: process.env['APP_URL'],
        trace: 'retain-on-failure',
        video: 'off',
        locale: browserLocale,
    },
    // We abuse this to wait for the external webserver
    webServer: {
        command: process.env['WEBSERVER_COMMAND'] ?? 'sleep 999d',
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
