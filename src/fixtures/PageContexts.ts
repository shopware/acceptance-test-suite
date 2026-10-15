import { test as base, expect } from "@playwright/test";
import type { Page, BrowserContext } from "playwright-core";
import type { FixtureTypes } from "../types/FixtureTypes";
import type { User } from "../types/ShopwareTypes";
import { isThemeCompiled } from "../services/ShopInfo";
import { clearDelayedCache } from "../services/Cache";
import { createNewAdminPageContext, hideSymfonyToolbarOnReload, loginToAdministration } from "../services/AdminLoginHelper";
import { LanguageHelper, setCurrentContext } from "../services/LanguageHelper";
import { getLocale } from "../services/ShopwareDataHelpers";

/** Reserved so the fixture fails with its own message before Playwright's generic fixture timeout. */
const THEME_SETUP_SAFETY_MARGIN = 15_000;

/** Attempts for the theme assign request while the shop answers with a server error. */
const THEME_ASSIGN_MAX_ATTEMPTS = 5;

export interface AdminSession {
    context: BrowserContext;
    user: User;
}

export interface PageContextTypes {
    AdminSession: AdminSession;
    AdminPage: Page;
    StorefrontPage: Page;
    InstallPage: Page;
    page: Page;
    context: BrowserContext;
}

type PageContextWorkerFixtures = Pick<FixtureTypes, "AdminSession" | "IdProvider" | "AdminApiContext" | "SalesChannelBaseConfig">;

export const test = base.extend<Omit<FixtureTypes, "AdminSession">, PageContextWorkerFixtures>({
    AdminSession: [
        async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser }, use) => {
            const { id, uuid } = IdProvider.getIdPair();

            const adminUser: User = {
                id: uuid,
                username: `admin_${id}`,
                firstName: `${id} admin`,
                lastName: `${id} admin`,
                localeId: SalesChannelBaseConfig.currentLocaleId,
                email: `admin_${id}@example.com`,
                timeZone: "Europe/Berlin",
                password: "shopware",
                admin: true,
            };

            const response = await AdminApiContext.post("user", {
                data: adminUser,
            });

            expect(response.ok()).toBeTruthy();

            // Log in through the UI once per worker. Tests get fresh pages within this
            // authenticated context instead of repeating the expensive admin login.
            const loginPage = await loginToAdministration(await createNewAdminPageContext(browser, SalesChannelBaseConfig), adminUser, AdminApiContext);
            const context = loginPage.context();
            await loginPage.close();

            await use({ context, user: adminUser });

            await context.close();

            // Cleanup created user
            await AdminApiContext.delete(`user/${uuid}`);
        },
        { scope: "worker" },
    ],

    AdminPage: async ({ AdminSession, CustomTranslationResources }, use) => {
        const locale = getLocale();
        const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

        // A new page within the shared worker context reuses the session and the browser
        // cache, but still gives every test an isolated DOM and JavaScript world.
        const page = await AdminSession.context.newPage();
        hideSymfonyToolbarOnReload(page);

        await page.goto("./");
        await page.waitForURL((url) => url.hash.startsWith("#/") && !url.hash.startsWith("#/login"));
        await expect(page.getByText(AdminSession.user.firstName + " " + AdminSession.user.lastName).first()).toBeVisible({ timeout: 60000 });
        await expect(page.locator(".sw-skeleton")).toHaveCount(0);

        LanguageHelper.setForContext(page.context() as unknown as Record<string, unknown>, languageHelper);
        setCurrentContext(page.context() as unknown as Record<string, unknown>);
        await use(page);
        await page.close();
        setCurrentContext(null);
    },

    StorefrontPage: async ({ DefaultSalesChannel, SalesChannelBaseConfig, browser, AdminApiContext, StoreApiContext, CustomTranslationResources }, use) => {
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

        let page;
        if (!(await isThemeCompiled(StoreApiContext, DefaultSalesChannel.url))) {
            base.slow();

            // One deadline for assigning and compiling the theme, inside the (tripled) test timeout.
            const deadline = Date.now() + (base.info().timeout || 180_000) - THEME_SETUP_SAFETY_MARGIN;
            const assignUrl = `./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${salesChannel.id}`;

            // Parallel workers assigning the same theme can make the shop fail the assign transaction (HTTP 500).
            // The conflict is transient, so retry server errors with a short backoff while time is left.
            let response = await AdminApiContext.post(assignUrl);
            for (let attempt = 1; attempt < THEME_ASSIGN_MAX_ATTEMPTS && response.status() >= 500 && Date.now() < deadline; attempt++) {
                console.warn(
                    `[Warning] Theme assign for sales channel ${salesChannel.id} failed with HTTP ${response.status()} (attempt ${attempt}), retrying: ${(await response.text()).slice(0, 500)}`
                );
                await new Promise((resolve) => setTimeout(resolve, 2_000 * attempt));
                response = await AdminApiContext.post(assignUrl);
            }

            // A failed assign used to be ignored; the test then ran without storefront CSS and JavaScript.
            if (!response.ok()) {
                throw new Error(`Theme assign for sales channel ${salesChannel.id} failed with HTTP ${response.status()}: ${(await response.text()).slice(0, 500)}`);
            }

            await clearDelayedCache(AdminApiContext);

            page = await context.newPage();

            // Compiled files can appear after the assign response (background compilation on SaaS, delayed cache).
            while (!(await isThemeCompiled(StoreApiContext, DefaultSalesChannel.url))) {
                if (Date.now() > deadline) {
                    throw new Error(`Theme for sales channel ${salesChannel.id} is still not compiled within the test timeout (${DefaultSalesChannel.url}).`);
                }

                await clearDelayedCache(AdminApiContext);
                await page.waitForTimeout(4000);
            }
        } else {
            page = await context.newPage();
        }

        await page.goto("./", { waitUntil: "load" });

        await use(page);

        await page.close();
        setCurrentContext(null);
        await context.close();
    },

    InstallPage: async ({ browser, CustomTranslationResources }, use) => {
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

    page: async ({ AdminPage }, use) => {
        await use(AdminPage);
    },

    context: async ({ AdminPage }, use) => {
        await use(AdminPage.context());
    },
});
