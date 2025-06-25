import { test as base } from '@playwright/test';
import { TestDataService } from '../services/TestDataService';
import type { FixtureTypes } from '../types/FixtureTypes';
import { ConfigOptions } from '../ConfigOptions';

export interface TestDataFixtureTypes {
    TestDataService: TestDataService;
}

type WorkerFixtures = FixtureTypes & {
    BaseConfig: ConfigOptions;
};

export const test = base.extend<WorkerFixtures>({

    TestDataService: async ({ AdminApiContext, IdProvider, DefaultSalesChannel, SalesChannelBaseConfig, BaseConfig }, use) => {
        const DataService = new TestDataService(AdminApiContext, IdProvider, {
            defaultSalesChannel: DefaultSalesChannel.salesChannel,
            defaultTaxId: SalesChannelBaseConfig.taxId,
            defaultCurrencyId: SalesChannelBaseConfig.defaultCurrencyId,
            defaultCategoryId: DefaultSalesChannel.salesChannel.navigationCategoryId,
            defaultLanguageId: DefaultSalesChannel.salesChannel.languageId,
            defaultCountryId: DefaultSalesChannel.salesChannel.countryId,
            defaultCustomerGroupId: DefaultSalesChannel.salesChannel.customerGroupId,
        }, BaseConfig);

        await use(DataService);

        if (BaseConfig.shopware.data?.cleanUp) {
            await DataService.cleanUp();
        }
    },
});
