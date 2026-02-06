import { test as base } from "@playwright/test";
import type { Locator } from "playwright-core";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const SelectProductFilterOption = base.extend<{ SelectProductFilterOption: Task }, FixtureTypes>({
    SelectProductFilterOption: async ({ ShopCustomer, StorefrontHome }, use) => {
        const task = (filterButton: Locator, optionName: string) => {
            return async function SelectProductFilterOption() {
                await ShopCustomer.presses(filterButton);
                const optionLocator = await StorefrontHome.getFilterItemByFilterName(optionName);
                await ShopCustomer.expects(optionLocator).not.toBeChecked();
                await ShopCustomer.presses(optionLocator);
                await ShopCustomer.expects(optionLocator).toBeChecked();
            };
        };

        await use(task);
    },
});
