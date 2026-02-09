import { expect } from "@playwright/test";
import type { Browser, BrowserContext, Page } from "@playwright/test";
import { mockApiCalls } from "./ApiMocks";
import { clearDelayedCache } from "./Cache";
import { translate } from "./LanguageHelper";
import type { DefaultSalesChannelTypes } from "../fixtures/DefaultSalesChannel";
import type { FixtureTypes } from "../types/FixtureTypes";
import type { User } from "../types/ShopwareTypes";

/**
 * Creates a new admin page context (login page) without the actual login.
 * @param browser - The Playwright Browser instance.
 * @param SalesChannelBaseConfig - The sales channel base configuration fixture.
 * @returns The Playwright Page instance for the admin login page.
 */
export async function createNewAdminPageContext(
    browser: Browser,
    SalesChannelBaseConfig: DefaultSalesChannelTypes["SalesChannelBaseConfig"],
): Promise<Page> {
    const context: BrowserContext = await browser.newContext({
        baseURL: SalesChannelBaseConfig.adminUrl,
        serviceWorkers: "block",
    });
    const adminPage = await context.newPage();
    await adminPage.goto("#/login");
    await mockApiCalls(adminPage);

    return adminPage;

}

/**
 * Performs admin login on the given page with the provided merchant user.
 * @param adminLoginPage - The Playwright Page instance for the admin login page.
 * @param merchant - The merchant user.
 * @param AdminApiContext - The API request context for admin API calls.
 * @returns The logged-in admin Page instance.
 */
export async function loginToAdministration(
    adminLoginPage: Page,
    merchant: User,
    AdminApiContext: FixtureTypes['AdminApiContext'],
): Promise<Page> {

    // Create locators at runtime when language is properly set
    const usernamePattern = new RegExp(`${translate("administration:login:username")}|${translate("administration:login:emailAddress")}`);
    const passwordLabel = translate("administration:login:password");

    await adminLoginPage.getByLabel(usernamePattern).fill(merchant.username);
    await adminLoginPage.getByLabel(passwordLabel, { exact: true }).fill(merchant.password);

    const config = (await (await AdminApiContext.get("./_info/config")).json()) as { bundles: Record<string, { js: string[] | undefined }> };

    const jsLoadingPromises = [];
    for (const i in config.bundles) {
        if (config.bundles[i]?.js && config.bundles[i]?.js?.length) {
            const js = config?.bundles[i]?.js ?? [];
            jsLoadingPromises.push(...js.map((url) => adminLoginPage.waitForResponse(url)));
        }
    }

    const loginButtonLabel = translate("administration:login:loginButton");
    await adminLoginPage.getByRole("button", { name: loginButtonLabel, exact: true }).click();

    // wait for all plugin js to be loaded
    await Promise.all(jsLoadingPromises);

    // Override page reload to also remove the Symfony toolbar
    const originalReload = adminLoginPage.reload.bind(adminLoginPage);
    adminLoginPage.reload = async () => {
        const res = await originalReload();
        await adminLoginPage.addStyleTag({
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

    await expect(adminLoginPage.locator(".sw-skeleton")).toHaveCount(0);
    await adminLoginPage.waitForURL((url) => {
        return url.hash !== "#login";
    });
    await expect(adminLoginPage.getByText(merchant.firstName + " " + merchant.lastName).first()).toBeVisible({ timeout: 60000 });

    return adminLoginPage;

}
