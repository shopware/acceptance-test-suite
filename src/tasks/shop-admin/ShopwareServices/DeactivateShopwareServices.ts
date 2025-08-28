import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';

export const DeactivateShopwareServices = base.extend<{ DeactivateShopwareServices: Task }, FixtureTypes>({
    DeactivateShopwareServices: async ({ ShopAdmin, AdminShopwareServices }, use ) => {
        const task = () => {
            return async function DeactivateShopwareServices() {

                if (AdminShopwareServices.url() != '#/sw/settings/services/index') {
                    await ShopAdmin.goesTo(AdminShopwareServices.url());
                }
                await AdminShopwareServices.deactivateServicesButton.click();
                await ShopAdmin.expects(AdminShopwareServices.deactivateServicesModal).toBeVisible();
                const disableResponsePromise = AdminShopwareServices.page.waitForResponse(`${ process.env['APP_URL'] }api/services/disable`);
                await AdminShopwareServices.deactivateServicesConfirmButton.click();
                const disableResponse = await disableResponsePromise;
                expect(disableResponse.ok()).toBeTruthy();
                await ShopAdmin.expects(AdminShopwareServices.deactivatedBanner).toBeVisible({ timeout: 15000 });
            }
        }
        await use(task);
    },
});