import { test as base, expect } from "@playwright/test";
import type { Page, BrowserContext } from "playwright-core";
import type { FixtureTypes } from "../types/FixtureTypes";
import { isThemeCompiled } from "../services/ShopInfo";
import { clearDelayedCache } from "../services/Cache";
import { createNewAdminPageContext, loginToAdministration } from "../services/AdminLoginHelper";
import { LanguageHelper, setCurrentContext } from "../services/LanguageHelper";
import { getLocale } from "../services/ShopwareDataHelpers";

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
    InstallPage: Page;
    page: Page;
    context: BrowserContext;
}


export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    AdminPage: [
        async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser, CustomTranslationResources }, use) => {
            const locale = getLocale();
            const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

            const { id, uuid } = IdProvider.getIdPair();

            const adminUser = {
                id: uuid,
                username: `admin_${id}`,
                firstName: `${id} admin`,
                lastName: `${id} admin`,
                localeId: SalesChannelBaseConfig.currentLocaleId,
                email: `admin_${id}@example.com`,
                timezone: "Europe/Berlin",
                password: "shopware",
                admin: true,
            };

            const response = await AdminApiContext.post("user", {
                data: adminUser,
            });

            expect(response.ok()).toBeTruthy();

            const page = await loginToAdministration(
                await createNewAdminPageContext(browser, SalesChannelBaseConfig),
                adminUser,
                AdminApiContext,
            );

            LanguageHelper.setForContext(page.context() as unknown as Record<string, unknown>, languageHelper);
            setCurrentContext(page.context() as unknown as Record<string, unknown>);
            await use(page);
            await page.close();
            setCurrentContext(null);

            // Cleanup created user
            await AdminApiContext.delete(`user/${uuid}`);
        },
        { scope: "worker" },
    ],

    StorefrontPage: [
        async ({ DefaultSalesChannel, SalesChannelBaseConfig, browser, AdminApiContext, StoreApiContext, InstanceMeta, CustomTranslationResources }, use) => {
            const { url, salesChannel } = DefaultSalesChannel;
            const locale = getLocale();
            const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

            const context = await browser.newContext({
                baseURL: url,
                locale,
                extraHTTPHeaders: { "Accept-Language": locale },
            });

            LanguageHelper.setForContext(context as unknown as Record<string, unknown>, languageHelper);

            // Set context for this execution thread
            setCurrentContext(context as unknown as Record<string, unknown>);

            const page = await context.newPage();
            if (!(await isThemeCompiled(StoreApiContext, DefaultSalesChannel.url))) {
                base.slow();

                // force sync theme compilation via no-queue flag, so we can properly await it here
                await AdminApiContext.post(`./_action/theme/${salesChannel.data.defaultThemeId}/assign/${salesChannel.data.id}?no-queue=true`);            await clearDelayedCache(AdminApiContext);
            }

            await page.goto("./", { waitUntil: "load" });

            await use(page);

            await page.close();
            setCurrentContext(null);
            await context.close();
        },
        { scope: "worker" },
    ],


    InstallPage: [
        async ({ browser, CustomTranslationResources }, use) => {
            const locale = getLocale();
            const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

            const context = await browser.newContext({
                baseURL: process.env["APP_URL"],
                locale,
                extraHTTPHeaders: { "Accept-Language": locale },
            });

            LanguageHelper.setForContext(context as unknown as Record<string, unknown>, languageHelper);
            setCurrentContext(context as unknown as Record<string, unknown>);

            const page = await context.newPage();

            await use(page);
            await page.close();
            setCurrentContext(null);
            await context.close();
        },
        { scope: "worker" },
    ],

    page: [
        async ({ AdminPage }, use) => {
            await use(AdminPage);
        },
    ],

    context: [
        async ({ AdminPage }, use) => {
            await use(AdminPage.context());
        },
    ],
});
