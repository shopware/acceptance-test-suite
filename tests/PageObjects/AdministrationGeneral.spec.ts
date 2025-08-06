import { test } from '../../src';
import { satisfies } from 'compare-versions';


test('Administration page objects - General.', async ({
    InstanceMeta,
    ShopAdmin,
    AdminDashboard,
    AdminCustomerListing,
    AdminManufacturerListing,
    AdminManufacturerCreate,
    AdminCustomerDetail,
    DefaultSalesChannel,
    AdminCategories,
    AdminLandingPageCreate,
    TestDataService,
    AdminOrderDetail,
    AdminProductDetail,
    AdminShopwareServices,
}) => {
    await ShopAdmin.goesTo(AdminCustomerListing.url(), InstanceMeta.isSaaS);
    await ShopAdmin.expects(AdminCustomerListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerListing.addCustomerButton).toBeVisible();

    await ShopAdmin.goesTo(AdminManufacturerCreate.url());
    await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminManufacturerCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerDetail.url(DefaultSalesChannel.customer.id));
    await ShopAdmin.expects(AdminCustomerDetail.accountCard).toBeVisible({ timeout: 15_000 });

    const category = await TestDataService.createCategory();
    await ShopAdmin.goesTo(AdminCategories.url());
    await ShopAdmin.expects(AdminCategories.landingPageHeadline).toBeVisible();
    await ShopAdmin.expects(AdminCategories.getTreeItemContextButton(category.name)).toBeVisible();

    await ShopAdmin.goesTo(AdminLandingPageCreate.url());
    await ShopAdmin.expects(AdminLandingPageCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminLandingPageCreate.saveLandingPageButton).toBeVisible();

    const product = await TestDataService.createBasicProduct();
    const customer = await TestDataService.createCustomer();
    const order = await TestDataService.createOrder([{ product, quantity: 1 }], customer);
    await ShopAdmin.goesTo(AdminOrderDetail.url(order.id));
    await ShopAdmin.expects(AdminOrderDetail.dataGridContextButton).toBeVisible();
    await ShopAdmin.expects(AdminOrderDetail.itemsCardHeader).toContainText('Items');
    await ShopAdmin.expects(AdminOrderDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminProductDetail.url(product.id));
    await ShopAdmin.expects(AdminProductDetail.savePhysicalProductButton).toBeVisible();
    await ShopAdmin.expects(AdminProductDetail.stockInput).toBeVisible();

    await ShopAdmin.goesTo(AdminManufacturerListing.url());
    await ShopAdmin.expects(AdminManufacturerListing.addManufacturerButton).toBeVisible();

    await ShopAdmin.goesTo(AdminDashboard.url());
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!InstanceMeta.isSaaS) {
        await ShopAdmin.expects(AdminDashboard.welcomeHeadline).toBeVisible();
    }

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (satisfies(InstanceMeta.version, '>=6.7.1')) {
        await ShopAdmin.expects(AdminDashboard.shopwareServicesAdvertisementBanner).toBeVisible();
        await ShopAdmin.expects(AdminDashboard.shopwareServicesAdvertisementBanner).toContainText('Introducing Shopware Services');
        await ShopAdmin.expects(AdminDashboard.shopwareServicesExploreNowButton).toBeVisible();
    }
    await ShopAdmin.expects(AdminDashboard.adminMenuUserActions).toBeVisible();
    await AdminDashboard.adminMenuUserActions.click();
    await ShopAdmin.expects(AdminDashboard.adminMenuLogoutButton).toBeVisible();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (satisfies(InstanceMeta.version, '>=6.7.1')) {
        await ShopAdmin.goesTo(AdminShopwareServices.url());
        await ShopAdmin.expects(AdminShopwareServices.header).toBeVisible();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesButton).toBeVisible();
        await AdminShopwareServices.deactivateServicesButton.click();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesModal).toBeVisible();
        await ShopAdmin.expects(AdminShopwareServices.deactivateServicesConfirmButton).toBeVisible();
        await AdminShopwareServices.deactivateServicesConfirmButton.click();
        await ShopAdmin.expects(AdminShopwareServices.activateServicesButton).toBeVisible();
        await AdminShopwareServices.activateServicesButton.click();
    }
});