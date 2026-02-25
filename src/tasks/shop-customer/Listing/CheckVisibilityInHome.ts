import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const CheckVisibilityInHome = base.extend<{ CheckVisibilityInHome: Task } & FixtureTypes>({
    CheckVisibilityInHome: async ({ ShopCustomer, StorefrontHome }, use) => {
        const task = (productName: string) => {
            return async function CheckVisibilityInHome() {
                const productLocators = await StorefrontHome.getListingItemByProductName(productName);

                await ShopCustomer.goesTo(StorefrontHome.url());
                await ShopCustomer.expects(productLocators.productName).toBeVisible();
            };
        };

        await use(task);
    },
});
