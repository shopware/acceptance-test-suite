import { test as base, expect } from '@playwright/test';
import type { Page, BrowserContext } from 'playwright-core';
import type { FixtureTypes } from '../types/FixtureTypes';
import { isThemeCompiled } from '../services/ShopInfo';
import { clearDelayedCache } from '../services/Cache';
import { createNewAdminPageContext } from '../services/AdminLoginHelper';
import { LanguageHelper, setCurrentContext } from '../services/LanguageHelper';

export interface PageContextTypes {
    AdminPage: Page;
    StorefrontPage: Page;
    InstallPage: Page;
    page: Page;
    context: BrowserContext;
}

export const test = base.extend<FixtureTypes>({
    AdminPage: async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig, browser, CustomTranslationResources }, use) => {
        const locale = process.env.LANG || process.env.LANGUAGE || process.env.lang || 'en-GB';
        const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

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

        LanguageHelper.setForContext(page.context() as unknown as Record<string, unknown>, languageHelper);
        setCurrentContext(page.context() as unknown as Record<string, unknown>);
        await use(page);
        await page.close();
        setCurrentContext(null);

        // Cleanup created user
        await AdminApiContext.delete(`user/${uuid}`);
    },

    StorefrontPage: async ({ DefaultSalesChannel, SalesChannelBaseConfig, browser, AdminApiContext, InstanceMeta, CustomTranslationResources }, use) => {
        const { url, salesChannel } = DefaultSalesChannel;
        const locale = process.env.LANG || process.env.LANGUAGE || process.env.lang || 'en-GB';

        const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

        const context = await browser.newContext({
            baseURL: url,
            locale,
            extraHTTPHeaders: { 'Accept-Language': locale },
        });

        LanguageHelper.setForContext(context as unknown as Record<string, unknown>, languageHelper);

        // Set context for this execution thread
        setCurrentContext(context as unknown as Record<string, unknown>);

        let page;
        if (!(await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url))) {
            base.slow();

            await AdminApiContext.post(`./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${salesChannel.id}`);
            await clearDelayedCache(AdminApiContext);

            page = await context.newPage();

            if (InstanceMeta.isSaaS) {
                while (!(await isThemeCompiled(AdminApiContext, DefaultSalesChannel.url))) {
                    await clearDelayedCache(AdminApiContext);
                    await page.waitForTimeout(4000);
                }
            }
        } else {
            page = await context.newPage();
        }

        await page.goto('./', { waitUntil: 'load' });

        await use(page);

        await page.close();
        setCurrentContext(null);
        await context.close();
    },

    InstallPage: async ({ browser, CustomTranslationResources }, use) => {
        const locale = process.env.LANG || process.env.LANGUAGE || process.env.lang || 'en-GB';

        const languageHelper = await LanguageHelper.createInstance(locale, CustomTranslationResources);

        const context = await browser.newContext({
            baseURL: process.env['APP_URL'],
            locale,
            extraHTTPHeaders: { 'Accept-Language': locale },
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
