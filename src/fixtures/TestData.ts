import { test as base } from '@playwright/test';
import { TestDataService } from '../services/TestDataService';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface TestDataFixtureTypes {
    TestDataService: TestDataService;
}

export const test = base.extend<FixtureTypes>({

    TestDataService: async ({ AdminApiContext, IdProvider, DefaultSalesChannel, SalesChannelBaseConfig }, use) => {
        const DataService = new TestDataService(AdminApiContext, IdProvider, {
            defaultSalesChannel: DefaultSalesChannel.salesChannel,
            defaultTaxId: SalesChannelBaseConfig.taxId,
            defaultCurrencyId: SalesChannelBaseConfig.defaultCurrencyId,
            defaultCategoryId: DefaultSalesChannel.salesChannel.navigationCategoryId,
            defaultLanguageId: DefaultSalesChannel.salesChannel.languageId,
            defaultCountryId: DefaultSalesChannel.salesChannel.countryId,
            defaultCustomerGroupId: DefaultSalesChannel.salesChannel.customerGroupId,
        })

        await use(DataService);

        await DataService.cleanUp();
    },
});
