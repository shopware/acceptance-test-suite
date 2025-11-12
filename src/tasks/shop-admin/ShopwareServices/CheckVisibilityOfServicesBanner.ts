import { expect, test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import type { User } from "../../../types/ShopwareTypes";
import { createNewAdminPageContext, loginToAdministration } from "../../../services/AdminLoginHelper";

export const CheckVisibilityOfServicesBanner = base.extend<{ CheckVisibilityOfServicesBanner: Task }, FixtureTypes>({
    CheckVisibilityOfServicesBanner: async ({ TestDataService, SalesChannelBaseConfig, browser }, use) => {
        const task = (customUser?: User) => {
            return async function CheckVisibilityOfServicesBanner() {
                const user = customUser ? customUser : await TestDataService.createUser();

                const adminPage = await loginToAdministration(
                    await createNewAdminPageContext(browser, SalesChannelBaseConfig),
                    user,
                    TestDataService.AdminApiClient,
                );
                const shopwareServicesAdvertisementBanner = adminPage.locator(".sw-settings-services-dashboard-banner__content").first();
                await expect(shopwareServicesAdvertisementBanner).toBeVisible();
            };
        };
        await use(task);
    },
});
