import { test as base } from '@playwright/test';
import { IdProvider } from '../services/IdProvider';

export interface HelperFixtureTypes {
    IdProvider: IdProvider;
}

export const test = base.extend<NonNullable<unknown>, HelperFixtureTypes>({
    IdProvider: [
        async ({}, use, workerInfo)=> {
            const seed = process.env.SHOPWARE_ACCESS_KEY_ID || process.env.SHOPWARE_ADMIN_PASSWORD || 'test-suite';
            const idProvider = new IdProvider(workerInfo.workerIndex, seed);

            await use(idProvider);
        },
        { scope: 'worker' },
    ],
});
