import { test as base, expect } from '@playwright/test';
import { IdProvider } from '../services/IdProvider';
import { isSaaSInstance } from '../services/ShopInfo';
import type { FixtureTypes } from '../types/FixtureTypes';
import { getCurrency, getLanguageData } from '../services/ShopwareDataHelpers';
import { AdminApiContext } from '../services/AdminApiContext';
import { satisfies } from 'compare-versions';
import type { Page } from '@playwright/test';

type FeaturesType = Record<string, boolean>;

export interface HelperFixtureTypes {
    IdProvider: IdProvider;
    SaaSInstanceSetup: () => Promise<void>,
    InstanceMeta: {
        version: string,
        isSaaS: boolean,
        features: FeaturesType,
    },
    HideElementsForScreenshot: (page: Page, selectors: string[]) => Promise<void>,
    ReplaceElementsForScreenshot: (page: Page, selectors: string[]) => Promise<void>,
    GetScreenshotDimensions: (page: Page, options: {
        requestURL?: string,
        width?: number,
        scrollableElementVertical?: string,
        scrollableElementHorizontal?: string,
        additionalHeight?: number
    }) => Promise<void>,
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    IdProvider: [
        async ({ }, use, workerInfo) => {
            const seed = process.env.SHOPWARE_ACCESS_KEY_ID || process.env.SHOPWARE_ADMIN_PASSWORD || 'test-suite';
            const idProvider = new IdProvider(workerInfo.parallelIndex, seed);

            await use(idProvider);
        },
        { scope: 'worker' },
    ],

    SaaSInstanceSetup: [
        async ({ AdminApiContext: context }, use) => {
            const SetupInstance = async function SetupInstance() {
                // eslint-disable-next-line playwright/no-skipped-test
                await test.skip(!(await isSaaSInstance(context)), 'Skipping SaaS setup, could not detect SaaS instance');

                expect(context.options.admin_username, 'setup requires admin user credentials').toEqual(expect.any(String));
                expect(context.options.admin_password, 'setup requires admin user credentials').toEqual(expect.any(String));

                // check tags
                const instanceStatusResponse = await context.get('./instance/status');
                const instanceStatus = await instanceStatusResponse.json() as { name: string, inStatusSince: string, tags: [string] };

                await expect(instanceStatus.tags, 'expect instance to have "ci" tag').toContain('ci');

                const currency = await getCurrency('USD', context);
                const language = await getLanguageData('en-US', context);

                await context.post('./_actions/set-default-entities',
                    { data: { currencyId: currency.id, languageId: language.id } }
                );

                // we need to be authenticated with an sbp user
                const token = await AdminApiContext.authenticateWithUserPassword(context.context, context.options);
                await context.post('./sbp/request-live-status', { headers: { Authorization: `Bearer ${token}` } });
            };

            await use(SetupInstance);
        },
        { scope: 'worker' },
    ],

    InstanceMeta: [
        async ({ AdminApiContext: context }, use) => {
            const response = await context.get('./_info/config');
            expect(response.ok(), '/_info/config request failed').toBeTruthy();
            const config = (await response.json()) as { version: string };

            const features: FeaturesType = {};
            if (satisfies(config.version, '>=6.6.1.0')) {
                const featuresResponse = await context.get('./_action/feature-flag');
                expect(featuresResponse.ok(), '/_action/feature-flag request failed').toBeTruthy();
                const data = (await featuresResponse.json()) as Record<string, { major: boolean, active: boolean }>;
                for (const k in data) {
                    features[k] = data[k].active;
                }
            }

            use({
                version: config.version,
                isSaaS: await isSaaSInstance(context),
                features,
            });
        },
        { scope: 'worker' },
    ],

    /**
     * Hides the given page elements using `visibility: hidden`, so they become invisible
     * without affecting the layout (no realignment occurs).
     *
     * @param selectors - A list of CSS selectors for the elements to hide.
     */

    HideElementsForScreenshot: [
        async ({ }, use) => {
            const fn = async (page: Page, selectors: string[]) => {
                if (!selectors.length) return;

                const css = selectors
                    .map(selector => `${selector} { visibility: hidden !important; }`)
                    .join('\n');

                await page.addStyleTag({ content: css });
            };

            await use(fn);
        },
        { scope: 'worker' },
    ],

    /**
     * Replaces the visible text content of the selected elements with "***",
     * typically used to mask sensitive information (e.g. names, prices).
     *
     * @param selectors - A list of CSS selectors for the elements whose content should be replaced.
     */

    ReplaceElementsForScreenshot : [
        async ({}, use) => {
            const fn = async (page: Page, selectors: string[]) => {
                if (!selectors.length) return;

                await page.evaluate((selectors: string[]) => {
                    selectors.forEach(selector => {
                        // @ts-expect-error no DOM types in this context
                        const elements = document.querySelectorAll(selector);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        elements.forEach((el: any) => {
                            el.textContent = '***';
                        });
                    });
                }, selectors);
            };

            await use(fn);
        },
        { scope: 'worker' },
    ],

    /**
     * Sets the viewport size for screenshots, ensuring that all scrollable content is visible.
     * @param page - The Playwright page object to set the viewport size on.
     * @param options - Optional parameters to customize the viewport size:
     *  requestURL: string - The URL to wait for before setting the viewport size (default is 'api/notification/message?limit=5' and should be replaced because it takes 3-5 seconds).
     *  width: number - The width of the viewport (default is 1440).
     *  scrollableElementVertical: string - The CSS selector for the scrollable element whose height will be used to set the viewport size (default is '.sw-card-view__content').
     *  scrollableElementHorizontal: string - The CSS selector for the scrollable element whose width will be used to set the viewport size (default is '.sw-data-grid__wrapper').
     *  additionalHeight: number - Additional height to add to the viewport size (default is 0).
     */
    GetScreenshotDimensions: [
        async ({ }, use) => {
            const viewportSize = async (
                page: Page, options: {
                    requestURL?: string,
                    width?: number,
                    scrollableElementVertical?: string,
                    scrollableElementHorizontal?: string,
                    additionalHeight?: number
                } = {
                    requestURL: 'api/notification/message?limit=5',
                    width: 1440,
                    scrollableElementVertical: '.sw-card-view__content',
                    scrollableElementHorizontal: '.sw-data-grid__wrapper',
                    additionalHeight: 0,
                }) => {
                await page.waitForResponse(response => response.url().includes(options.requestURL ?? 'api/notification/message?limit=5'));
                const scrollableElementVertical = page.locator(options.scrollableElementVertical ?? '.sw-card-view__content');
                let pageHeight = 1080; // Default height
                if (await scrollableElementVertical.count() > 0) {
                    pageHeight = await scrollableElementVertical.evaluate(el => el.scrollHeight);
                }
                const header = page.locator('.sw-page__head-area');
                let headerHeight = 0;
                if (await header.count() > 0) {
                    headerHeight = await header.evaluate(el => el.offsetHeight);
                }
                const scrollableElementHorizontal = page.locator(options.scrollableElementHorizontal ?? '.sw-data-grid__wrapper')
                let pageWidth = options.width ?? 1440; // Default width
                if (await scrollableElementHorizontal.count() > 0) {
                    pageWidth = (await scrollableElementHorizontal.evaluate(el => el.scrollWidth));
                }
                await page.setViewportSize({
                    width: pageWidth,
                    height: pageHeight + headerHeight + (options.additionalHeight ?? 0) });
            };
            await use(viewportSize);
        },
        { scope: 'worker' },
    ],
});