import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';
import { mockApiCalls } from '../services/ApiMocks';
import { isSaaSInstance, isThemeCompiled } from '../services/ShopInfo';

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
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
        await page.getByLabel('Password').fill(adminUser.password);

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

        // Run the test
        await use(page);

        await page.close();
        await context.close();

        // Cleanup created user
        await AdminApiContext.delete(`user/${uuid}`);
    },

    StorefrontPage: async ({ DefaultSalesChannel, SalesChannelBaseConfig, browser, AdminApiContext }, use) => {
        const { url, salesChannel } = DefaultSalesChannel;

        const context = await browser.newContext({
            baseURL: url,
        });
        const page = await context.newPage();

        const isSaasInstance = await isSaaSInstance(AdminApiContext);

        if (!await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url)) {
            base.slow();

            await AdminApiContext.post(
                `./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${salesChannel.id}`
            );

            if (isSaasInstance) {
                while (!await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url)) {
                    // eslint-disable-next-line playwright/no-wait-for-timeout
                    await page.waitForTimeout(4000);
                }
            }
        }

        await page.goto('./', { waitUntil: 'load' });

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