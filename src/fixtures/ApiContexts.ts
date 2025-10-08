import { test as base } from '@playwright/test';
import { AdminApiContext } from '../services/AdminApiContext';
import { StoreApiContext } from '../services/StoreApiContext';
import { MailpitApiContext } from '../services/MailpitApiContext';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface ApiContextTypes {
    AdminApiContext: AdminApiContext;
    StoreApiContext: StoreApiContext;
    MailpitApiContext: MailpitApiContext;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    AdminApiContext: [
        // eslint-disable-next-line no-empty-pattern
        async ({ }, use) => {
            const adminApiContext = await AdminApiContext.create();
            await use(adminApiContext);
            await adminApiContext.dispose();
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

    MailpitApiContext: [
        // eslint-disable-next-line no-empty-pattern
        async ({ }, use) => {
            const mailpitApiContext = await MailpitApiContext.create(process.env['MAILPIT_BASE_URL'] as string);

            await use(mailpitApiContext);
        },
        { scope: 'worker' },
    ],
});