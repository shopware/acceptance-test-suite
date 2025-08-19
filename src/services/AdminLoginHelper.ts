import { expect } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { mockApiCalls } from './ApiMocks';
import { clearDelayedCache } from './Cache';
import type { User } from '../types/ShopwareTypes';
import type { DefaultSalesChannelTypes } from '../fixtures/DefaultSalesChannel';
import type { FixtureTypes } from '../types/FixtureTypes';

export async function createNewAdminPageContext(merchant: User, browser: Browser, SalesChannelBaseConfig: DefaultSalesChannelTypes['SalesChannelBaseConfig'], AdminApiContext: FixtureTypes['AdminApiContext']): Promise<Page> {

    const context: BrowserContext = await browser.newContext({
        baseURL: SalesChannelBaseConfig.adminUrl,
        serviceWorkers: 'block',
    });
    const adminPage = await context.newPage();
    await adminPage.goto('#/login');
    await mockApiCalls(adminPage);

    await adminPage.getByLabel(/Username|Email address/).fill(merchant.username);
    await adminPage.getByLabel('Password', { exact: true }).fill(merchant.password);

    const config = await (await AdminApiContext.get('./_info/config')).json() as { bundles: Record<string, { js: string[] | undefined }> };

    const jsLoadingPromises = [];
    for (const i in config.bundles) {
        if (config.bundles[i]?.js && config.bundles[i]?.js?.length) {
            const js = config?.bundles[i]?.js ?? [];
            jsLoadingPromises.push(...js.map(url => adminPage.waitForResponse(url)));
        }
    }

    await adminPage.getByRole('button', { name: 'Log in' }).click();

    // wait for all plugin js to be loaded
    await Promise.all(jsLoadingPromises);

    // Override page reload to also remove the Symfony toolbar
    const originalReload = adminPage.reload.bind(adminPage);
    adminPage.reload = async () => {
        const res = await originalReload();
        await adminPage.addStyleTag({
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

    await expect(adminPage.locator('.sw-skeleton')).toHaveCount(0);
    await adminPage.waitForURL((url) => {
        return url.hash !== '#login';
    });
    await expect(adminPage.getByText(merchant.firstName + ' ' + merchant.lastName).first()).toBeVisible({ timeout: 60000 });

    return adminPage;
}