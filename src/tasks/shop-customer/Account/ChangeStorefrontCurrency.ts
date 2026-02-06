import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
export const ChangeStorefrontCurrency = base.extend<{ ChangeStorefrontCurrency: Task }, FixtureTypes>({
    ChangeStorefrontCurrency: async ({ ShopCustomer, StorefrontHeader }, use) => {
        const task = (currencyName: string) => {
            return async function ChangeStorefrontCurrency() {
                await ShopCustomer.presses(StorefrontHeader.currenciesDropdown);
                await ShopCustomer.presses(StorefrontHeader.currenciesMenuOptions.getByText(currencyName));
            };
        };

        await use(task);
    },
});
