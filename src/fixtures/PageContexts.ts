import { test as base, expect, Page } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
}

export const test = base.extend<FixtureTypes>({

    AdminPage: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser }, use) => {
        const context = await browser.newContext({
            baseURL: SalesChannelBaseConfig.adminUrl,
        });
        const page = await context.newPage();

        const { id, uuid } = IdProvider.getIdPair();

        const adminUser = {
            id: uuid,
            username: `admin_${id}`,
            firstName: `${id} admin`,
            lastName: `${id} admin`,
            localeId: SalesChannelBaseConfig.enGBLocaleId,
            email: `admin_${id}@example.com`,
            timezone: 'Europe/Berlin',
            password: 'shopware',
            admin: true,
        };

        const response = await AdminApiContext.post('user', {
            data: adminUser,
        });

        expect(response.ok()).toBeTruthy();

        await page.goto('#/login');

        await page.getByLabel('Username').fill(adminUser.username);
        await page.getByLabel('Password').fill(adminUser.password);

        await page.getByRole('button', { name: 'Log in' }).click();

        // Wait until the page is loaded
        await expect(page.locator('css=.sw-admin-menu__header-logo').first()).toBeVisible({
            timeout: 20000,
        });

        await expect(page.locator('.sw-skeleton')).toHaveCount(0, {
            timeout: 10000,
        });

        await expect(page.locator('.sw-loader')).toHaveCount(0, {
            timeout: 10000,
        });

        await page.addStyleTag({
            content: `
                .sf-toolbar {
                    width: 0 !important;
                    height: 0 !important;
                    display: none !important;
                    pointer-events: none !important;
                }
                `.trim(),
        });

        // Run the test
        await use(page);

        await page.close();
        await context.close();

        // Cleanup created user
        const cleanupResponse = await AdminApiContext.delete(`user/${uuid}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },

    StorefrontPage: async ({ DefaultSalesChannel, browser }, use) => {
        const { url } = DefaultSalesChannel;

        const context = await browser.newContext({
            baseURL: url,
        });
        const page = await context.newPage();

        await page.goto('./');

        await use(page);

        await page.close();
        await context.close();
    },
});
