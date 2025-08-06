import { test as base, expect } from '@playwright/test';
import type { Page, BrowserContext } from 'playwright-core';
import type { FixtureTypes } from '../types/FixtureTypes';
import { isThemeCompiled } from '../services/ShopInfo';
import { clearDelayedCache } from '../services/Cache';
import { createNewAdminPageContext } from '../services/AdminLoginHelper';

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
    InstallPage: Page;
    page: Page;
    context: BrowserContext;
}

export const test = base.extend<FixtureTypes>({

    AdminPage: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser }, use) => {

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

        const page = await createNewAdminPageContext(adminUser, browser, SalesChannelBaseConfig, AdminApiContext);

        // Run the test
        await use(page);

        await page.close();

        // Cleanup created user
        await AdminApiContext.delete(`user/${uuid}`);
    },

    StorefrontPage: async ({ DefaultSalesChannel, SalesChannelBaseConfig, browser, AdminApiContext, InstanceMeta }, use) => {
        const { url, salesChannel } = DefaultSalesChannel;

        const context = await browser.newContext({
            baseURL: url,
        });

        let page;
        if (!await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url)) {
            base.slow();

            await AdminApiContext.post(
                `./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${salesChannel.id}`
            );
            await clearDelayedCache(AdminApiContext);

            page = await context.newPage();

            if (InstanceMeta.isSaaS) {
                while (!await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url)) {
                    await clearDelayedCache(AdminApiContext);
                    // eslint-disable-next-line playwright/no-wait-for-timeout
                    await page.waitForTimeout(4000);
                }
            }
        } else {
            page = await context.newPage();
        }

        await page.goto('./', { waitUntil: 'load' });

        await use(page);

        await page.close();
        await context.close();
    },

    InstallPage: async ({ browser }, use) => {

        const context = await browser.newContext({
            baseURL: process.env['APP_URL'],
        });
        const page = await context.newPage();

        await use(page);

        await page.close();
        await context.close();
    },

    page: async ({ AdminPage }, use) => {
        await use(AdminPage);
    },

    context: async ({ AdminPage }, use) => {
        await use(AdminPage.context());
    },
});