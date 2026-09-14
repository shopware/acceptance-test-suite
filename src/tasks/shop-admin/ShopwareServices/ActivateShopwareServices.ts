import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const ActivateShopwareServices = base.extend<{ ActivateShopwareServices: Task }, FixtureTypes>({
    ActivateShopwareServices: async ({ ShopAdmin, AdminShopwareServices }, use) => {
        const task = () => {
            return async function ActivateShopwareServices() {
                if (AdminShopwareServices.url() != "#/sw/settings/services/index") {
                    await ShopAdmin.goesTo(AdminShopwareServices.url());
                }
                const enableResponsePromise = AdminShopwareServices.page.waitForResponse(`${process.env["APP_URL"]}api/services/enable`);
                await AdminShopwareServices.activateServicesButton.click();
                const enableResponse = await enableResponsePromise;
                expect(enableResponse.ok()).toBeTruthy();
                await ShopAdmin.expects(AdminShopwareServices.deactivateServicesButton).toBeVisible({ timeout: 15000 });
            };
        };
        await use(task);
    },
});
