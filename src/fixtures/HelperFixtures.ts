import { test as base, expect } from '@playwright/test';
import { IdProvider } from '../services/IdProvider';
import { isSaaSInstance } from '../services/ShopInfo';
import type { FixtureTypes } from '../types/FixtureTypes';
import { getCurrency, getLanguageData } from '../services/ShopwareDataHelpers';
import { AdminApiContext } from '../services/AdminApiContext';

export interface HelperFixtureTypes {
    IdProvider: IdProvider;
    SaaSInstanceSetup: () => Promise<void>,
    InstanceMeta: {
        version: string,
        isSaaS: boolean,
    },
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
            use({
                version: config.version,
                isSaaS: await isSaaSInstance(context),
            });
        },
        { scope: 'worker' },
    ],
});
