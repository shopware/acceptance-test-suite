import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
export const ChangeStorefrontCurrency = base.extend<{ ChangeStorefrontCurrency: Task }, FixtureTypes>({
    ChangeStorefrontCurrency: async ({ ShopCustomer, StorefrontHome }, use) => {
        const task = (currencyName: string) => {
            return async function ChangeStorefrontCurrency() {
                await ShopCustomer.presses(StorefrontHome.currenciesDropdown);
                await ShopCustomer.presses(StorefrontHome.currenciesMenuOptions.getByText(currencyName));

            }
        };

        await use(task);
    },
});