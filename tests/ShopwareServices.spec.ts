import { test, expect, translate } from '../src';
import { satisfies } from 'compare-versions';

test('Shopware Services', async ({ InstanceMeta, ShopAdmin, AdminDashboard, AdminShopwareServices }) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (satisfies(InstanceMeta.version, '>=6.7.1') && !InstanceMeta.isSaaS) {
        await ShopAdmin.expects(AdminDashboard.shopwareServicesAdvertisementBanner).toBeVisible();
        await ShopAdmin.expects(AdminDashboard.shopwareServicesAdvertisementBanner).toContainText(
            translate('administration:shopwareServices:dashboard.shopwareServicesIntroduction'),
        );
        await ShopAdmin.expects(AdminDashboard.shopwareServicesExploreNowButton).toBeVisible();

        await ShopAdmin.goesTo(AdminShopwareServices.url());
        await ShopAdmin.expects(AdminShopwareServices.header).toBeVisible();
        try {
            await ShopAdmin.expects(AdminShopwareServices.deactivateServicesButton).toBeVisible();
        } catch (e) {
            await AdminShopwareServices.activateServicesButton.click();
        }

        await AdminShopwareServices.deactivateServicesButton.click();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesModal).toBeVisible();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesConfirmButton).toBeVisible();
        const disableResponsePromise = AdminShopwareServices.page.waitForResponse(`${process.env['APP_URL']}api/services/disable`);
        await AdminShopwareServices.deactivateServicesConfirmButton.click();
        const disableResponse = await disableResponsePromise;
        expect(disableResponse.ok()).toBeTruthy();
        // enable the services again for further tests
        await ShopAdmin.expects(AdminShopwareServices.activateServicesButton).toBeVisible({ timeout: 15000 });
        const enableResponsePromise = AdminShopwareServices.page.waitForResponse(`${process.env['APP_URL']}api/services/enable`);
        await AdminShopwareServices.activateServicesButton.click();
        const enableResponse = await enableResponsePromise;
        expect(enableResponse.ok()).toBeTruthy();
        await AdminShopwareServices.page.reload();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesButton).toBeVisible({ timeout: 15000 });
    }
});
