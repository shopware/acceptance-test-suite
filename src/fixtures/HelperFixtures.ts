import { test as base, expect } from '@playwright/test';
import { IdProvider } from '../services/IdProvider';
import { isSaaSInstance } from '../services/ShopInfo';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface HelperFixtureTypes {
    IdProvider: IdProvider;
    SaaSInstanceSetup: () => Promise<void>,
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
        async ({ AdminApiContext, browser }, use) => {
            const SetupInstance = async function SetupInstance() {
                // eslint-disable-next-line playwright/no-skipped-test
                await test.skip(!(await isSaaSInstance(AdminApiContext)), 'Skipping SaaS setup, could not detect SaaS instance');

                // check tags
                const instanceStatusResponse = await AdminApiContext.get('./instance/status');
                const instanceStatus = await instanceStatusResponse.json() as { name: string, inStatusSince: string, tags: [string] };

                await expect(instanceStatus.tags, 'expect instance to have "ci" tag').toContain('ci');

                // eslint-disable-next-line playwright/no-skipped-test
                await test.skip((await AdminApiContext.get(`${process.env.APP_URL}constructionmode`, { maxRedirects: 0 })).status() > 204, 'Instance already setup');

                const page = await browser.newPage({ baseURL: process.env.ADMIN_URL });

                await page.goto('./set-up-shop');
                await page.getByRole('button', { name: 'Next' }).click();

                await expect(page.getByRole('heading', { name: 'Everything finished!' })).toBeVisible();

                await page.getByRole('button', { name: 'Open your shop' }).click();
                await page.goto(`${process.env.ADMIN_URL}`);
                await page.getByLabel(/Username|Email address/).fill(AdminApiContext.options.admin_username ?? 'admin');
                await page.getByLabel('Password').fill(AdminApiContext.options.admin_password ?? 'shopware');
                await page.getByRole('button', { name: 'Log in' }).click();

                await page.getByRole('button', { name: 'Launch your business' }).click();
            };

            await use(SetupInstance);
        },
        { scope: 'worker' },
    ],
});
