import { expect } from '@playwright/test';
import type { Browser, BrowserContext, Page } from '@playwright/test';
import { mockApiCalls } from './ApiMocks';
import { clearDelayedCache } from './Cache';
import { translate } from './LanguageHelper';
import type { User } from '../types/ShopwareTypes';
import type { DefaultSalesChannelTypes } from '../fixtures/DefaultSalesChannel';
import type { FixtureTypes } from '../types/FixtureTypes';

export async function createNewAdminPageContext(
    merchant: User,
    browser: Browser,
    SalesChannelBaseConfig: DefaultSalesChannelTypes['SalesChannelBaseConfig'],
    AdminApiContext: FixtureTypes['AdminApiContext'],
): Promise<Page> {
    const context: BrowserContext = await browser.newContext({
        baseURL: SalesChannelBaseConfig.adminUrl,
        serviceWorkers: 'block',
    });
    const adminPage = await context.newPage();
    await adminPage.goto('#/login');
    await mockApiCalls(adminPage);

    // Create locators at runtime when language is properly set
    const usernamePattern = new RegExp(`${translate('administration:login:username')}|${translate('administration:login:emailAddress')}`);
    const passwordLabel = translate('administration:login:password');

    await adminPage.getByLabel(usernamePattern).fill(merchant.username);
    await adminPage.getByLabel(passwordLabel, { exact: true }).fill(merchant.password);

    const config = (await (await AdminApiContext.get('./_info/config')).json()) as { bundles: Record<string, { js: string[] | undefined }> };

    const jsLoadingPromises = [];
    for (const i in config.bundles) {
        if (config.bundles[i]?.js && config.bundles[i]?.js?.length) {
            const js = config?.bundles[i]?.js ?? [];
            jsLoadingPromises.push(...js.map((url) => adminPage.waitForResponse(url)));
        }
    }

    const loginButtonLabel = translate('administration:login:loginButton');
    await adminPage.getByRole('button', { name: loginButtonLabel, exact: true }).click();

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
