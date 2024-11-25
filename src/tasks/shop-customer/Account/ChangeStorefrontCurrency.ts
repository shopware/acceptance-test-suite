import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
export const ChangeStorefrontCurrency = base.extend<{ ChangeStorefrontCurrency: Task }, FixtureTypes>({
    ChangeStorefrontCurrency: async ({ StorefrontHome }, use) => {
        const task = (isoCode: string) => {
            return async function ChangeStorefrontCurrency() {
                await StorefrontHome.currenciesDropdown.click();
                await StorefrontHome.currenciesDropdown.getByText(' '+isoCode).click();

            }
        };

        await use(task);
    },
});