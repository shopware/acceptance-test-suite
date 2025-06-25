import { test as base } from '@playwright/test';
import { AdminApiContext } from '../services/AdminApiContext';
import { StoreApiContext } from '../services/StoreApiContext';
import { MailpitApiContext } from '../services/MailpitApiContext';
import type { FixtureTypes } from '../types/FixtureTypes';
import type { ConfigOptions } from '../ConfigOptions';

export interface ApiContextTypes {
    AdminApiContext: AdminApiContext;
    StoreApiContext: StoreApiContext;
    MailpitApiContext: MailpitApiContext;
}

type WorkerFixtures = FixtureTypes & {
    BaseConfig: ConfigOptions;
};

export const test = base.extend<WorkerFixtures>({
    AdminApiContext: [
        async ({ BaseConfig }, use) => {
            const adminApiContext = await AdminApiContext.create({
                app_url: BaseConfig.shopware.adminAPIURL,
                client_id: BaseConfig.shopware.auth?.accessKeyId,
                client_secret: BaseConfig.shopware.auth?.secretAccessKey,
                admin_username: BaseConfig.shopware.auth?.adminUsername,
                admin_password: BaseConfig.shopware.auth?.adminPassword,
            });
            await use(adminApiContext);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { scope: 'worker' } as any,
    ],

    StoreApiContext: [
        async ({ DefaultSalesChannel }, use) => {
            const options = {
                app_url: DefaultSalesChannel.url,
                'sw-access-key': DefaultSalesChannel.salesChannel.accessKey,
                ignoreHTTPSErrors: true,
            };

            const storeApiContext = await StoreApiContext.create(options);
            await use(storeApiContext);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { scope: 'worker' } as any,
    ],

    MailpitApiContext: [
        async ({ BaseConfig }, use) => {
            const mailpitApiContext = await MailpitApiContext.create(BaseConfig.shopware.mailpitBaseURL ?? '');
            await use(mailpitApiContext);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { scope: 'worker' } as any,
    ],
});