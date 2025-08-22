import { expect, test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { AclRole, User } from '../../../types/ShopwareTypes';
import { createNewAdminPageContext } from '../../../services/AdminLoginHelper';

export const CheckAccessToShopwareServices = base.extend<{ CheckAccessToShopwareServices: Task }, FixtureTypes>({
    CheckAccessToShopwareServices: async ({ TestDataService, SalesChannelBaseConfig, browser }, use ) => {
        const task = (customUser?: User, aclRole?: AclRole) => {
            return async function CheckAccessToShopwareServices() {

                let user;

                if (customUser === undefined) {
                    user = await TestDataService.createUser();
                } else {
                    user = await TestDataService.getUserById(customUser.id);
                    user.password = customUser.password;
                }

                const adminPage = await createNewAdminPageContext(user, browser, SalesChannelBaseConfig, TestDataService.AdminApiClient);

                const shopwareServicesAdvertisementBanner = adminPage.locator('.sw-settings-services-dashboard-banner__content').first();
                const shopwareServicesExploreNowButton = shopwareServicesAdvertisementBanner.getByRole('button', { name: 'Explore now' });

                await expect(shopwareServicesAdvertisementBanner).toBeVisible();
                await expect(shopwareServicesExploreNowButton).toBeVisible();
                await expect(shopwareServicesAdvertisementBanner).toContainText('Introducing Shopware Services');
                await shopwareServicesExploreNowButton.click();

                const adminPrivilegeHeader = adminPage.getByRole('heading', { name: 'Access denied' }).first();
                const shopwareServicesHeader = adminPage.getByRole('heading', { name: 'Future proof your store with Shopware Services' });

                if (!aclRole?.privileges.includes('system:plugin:maintain')) {
                    await expect(adminPrivilegeHeader).toBeVisible();
                } else {
                    await expect(adminPrivilegeHeader).toBeHidden();
                    await expect(shopwareServicesHeader).toBeVisible();
                }
            }
        }
        await use(task);
    },
});
