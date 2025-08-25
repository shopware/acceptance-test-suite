import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const DeactivateShopwareServices = base.extend<{ DeactivateShopwareServices: Task }, FixtureTypes>({
    DeactivateShopwareServices: async ({ ShopAdmin, AdminShopwareServices }, use ) => {
        const task = () => {
            return async function DeactivateShopwareServices() {

                if (AdminShopwareServices.url() != '#/sw/settings/services/index') {
                    await ShopAdmin.goesTo(AdminShopwareServices.url());
                }
                await AdminShopwareServices.deactivateServicesButton.click();
                await ShopAdmin.expects(AdminShopwareServices.deactivateServicesModal).toBeVisible();
                await AdminShopwareServices.deactivateServicesConfirmButton.click();
                await ShopAdmin.expects(AdminShopwareServices.deactivatedBanner).toBeVisible();
            }
        }
        await use(task);
    },
});