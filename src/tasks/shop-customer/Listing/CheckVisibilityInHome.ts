import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const CheckVisibilityInHome = base.extend<{ CheckVisibilityInHome: Task } & FixtureTypes>({
    CheckVisibilityInHome: async ({ ShopCustomer, StorefrontHome, TestDataService }, use) => {
        const task = (productName: string) => {
            return async function CheckVisibilityInHome() {
                await TestDataService.clearCaches();
                const productLocators = await StorefrontHome.getListingItemByProductName(productName);

                await ShopCustomer.expects(async () => {
                    await ShopCustomer.goesTo(`${StorefrontHome.url()}?a=${Date.now()}`);
                    await ShopCustomer.expects(productLocators.productName).toBeVisible();
                }).toPass({
                    intervals: [1_000, 2_500], // retry after 1 seconds, then every 2.5 seconds
                });
            };
        };

        await use(task);
    },
});
