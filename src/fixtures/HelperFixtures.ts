import { test as base, expect } from '@playwright/test';
import { IdProvider } from '../services/IdProvider';
import { isSaaSInstance } from '../services/ShopInfo';
import type { FixtureTypes } from '../types/FixtureTypes';
import { getCurrency, getLanguageCode, getLanguageData, getLocale } from '../services/ShopwareDataHelpers';
import { AdminApiContext } from '../services/AdminApiContext';
import { satisfies } from 'compare-versions';
import type { TranslateFn, TranslationKey } from '../types/TranslationTypes';
import { BUNDLED_RESOURCES } from '../locales';

type FeaturesType = Record<string, boolean>;

export interface HelperFixtureTypes {
    IdProvider: IdProvider;
    SaaSInstanceSetup: () => Promise<void>;
    InstanceMeta: {
        version: string;
        isSaaS: boolean;
        features: FeaturesType;
    };
    CustomTranslationResources: typeof BUNDLED_RESOURCES | undefined;
    Translate: TranslateFn;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    IdProvider: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use, workerInfo) => {
            const seed = process.env.SHOPWARE_ACCESS_KEY_ID || process.env.SHOPWARE_ADMIN_PASSWORD || 'test-suite';
            const idProvider = new IdProvider(workerInfo.parallelIndex, seed);

            await use(idProvider);
        },
        { scope: 'worker' },
    ],

    SaaSInstanceSetup: [
        async ({ AdminApiContext: context }, use) => {
            const SetupInstance = async function SetupInstance() {
                test.skip(!(await isSaaSInstance(context)), 'Skipping SaaS setup, could not detect SaaS instance');

                expect(context.options.admin_username, 'setup requires admin user credentials').toEqual(expect.any(String));
                expect(context.options.admin_password, 'setup requires admin user credentials').toEqual(expect.any(String));

                // check tags
                const instanceStatusResponse = await context.get('./instance/status');
                const instanceStatus = (await instanceStatusResponse.json()) as { name: string; inStatusSince: string; tags: [string] };

                expect(instanceStatus.tags, 'expect instance to have "ci" tag').toContain('ci');
                const currency = await getCurrency(context);
                const language = await getLanguageData(context);

                await context.post('./_actions/set-default-entities', { data: { currencyId: currency.id, languageId: language.id } });

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
                const data = (await featuresResponse.json()) as Record<string, { major: boolean; active: boolean }>;
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

    CustomTranslationResources: [
        // eslint-disable-next-line no-empty-pattern
        async ({}, use) => {
            await use(undefined);
        },
        { scope: 'worker' },
    ],

    Translate: [
        async ({ CustomTranslationResources }, use) => {
            const { LanguageHelper, setCurrentContext } = await import('../services/LanguageHelper');
            const languageCode = getLanguageCode(getLocale());
            const languageHelper = await LanguageHelper.createInstance(languageCode.split('-')[0], CustomTranslationResources);

            setCurrentContext({ languageHelper });

            const contextualTranslate: TranslateFn = (key: TranslationKey, options?: Record<string, unknown>): string => {
                return languageHelper.translate(key, options);
            };

            await use(contextualTranslate);

            setCurrentContext(null);
        },
        { scope: 'worker' },
    ],
});
