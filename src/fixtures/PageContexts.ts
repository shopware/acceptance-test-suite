import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';
import { mockApiCalls } from '../services/ApiMocks';
import { isThemeCompiled } from '../services/ShopInfo';
import { clearDelayedCache } from 'src/services/Cache';

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
    InstallPage: Page;
    page: Page;
    context: BrowserContext;
}

export const test = base.extend<FixtureTypes>({

    AdminPage: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser }, use) => {
        const context = await browser.newContext({
            baseURL: SalesChannelBaseConfig.adminUrl,
            serviceWorkers: 'block',
        });
        const page = await context.newPage();

        await mockApiCalls(page);

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

        await expect(page.url()).toContain('login');

        await page.getByLabel(/Username|Email address/).fill(adminUser.username);
        await page.getByLabel('Password', { exact: true }).fill(adminUser.password);

        const config = await (await AdminApiContext.get('./_info/config')).json() as { bundles: Record<string, { js: string[] | undefined }> };

        const jsLoadingPromises = [];
        for (const i in config.bundles) {
            if (config.bundles[i]?.js && config.bundles[i]?.js?.length) {
                const js = config?.bundles[i]?.js ?? [];
                jsLoadingPromises.push(...js.map(url => page.waitForResponse(url)));
            }
        }

        await page.getByRole('button', { name: 'Log in' }).click();

        // wait for all plugin js to be loaded
        await Promise.all(jsLoadingPromises);

        // Override page reload to also remove the Symfony toolbar
        const originalReload = page.reload.bind(page);
        page.reload = async () => {
            const res = await originalReload();
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
            return res;
        };

        await clearDelayedCache(AdminApiContext);

        // Run the test
        await use(page);

        await page.close();
        await context.close();

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