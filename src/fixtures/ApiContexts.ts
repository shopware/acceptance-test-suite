import { test as base } from '@playwright/test';
import { AdminApiContext } from '../services/AdminApiContext';
import { StoreApiContext } from '../services/StoreApiContext';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface ApiContextTypes {
    AdminApiContext: AdminApiContext;
    StoreApiContext: StoreApiContext;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    AdminApiContext: [
        async ({}, use) => {
            const adminApiContext = await AdminApiContext.create();
            await use(adminApiContext);
        },
        { scope: 'worker' },
    ],

    StoreApiContext: [
        async ({ DefaultSalesChannel }, use) => {
            const options = {
                app_url: process.env['APP_URL'],
                'sw-access-key': DefaultSalesChannel.salesChannel.accessKey,
                ignoreHTTPSErrors: true,
            };

            const storeApiContext = await StoreApiContext.create(options);
            await use(storeApiContext);
        },
        { scope: 'worker' },
    ],
});