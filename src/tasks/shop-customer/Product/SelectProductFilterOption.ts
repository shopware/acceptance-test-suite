import { test as base, Locator } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';

export const SelectProductFilterOption = base.extend<{ SelectProductFilterOption: Task }, FixtureTypes>({
    SelectProductFilterOption: async ({ StorefrontHome }, use) => {
        const task = (filterButton: Locator, optionName: string) => {
            return async function SelectProductFilterOption() {
                await filterButton.click();
                const optionLocator = await StorefrontHome.getFilterItemByFilterName(optionName);
                await optionLocator.click();
            }
        };

        await use(task);
    },
});