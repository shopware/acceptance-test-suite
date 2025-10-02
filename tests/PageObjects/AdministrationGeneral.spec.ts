import { test, translate } from '../../src';

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
    AdminMedia,
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
    await ShopAdmin.expects(AdminOrderDetail.itemsCardHeader).toContainText(translate('administration:order:detail.items'));
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

    await ShopAdmin.goesTo(AdminMedia.url());
    await ShopAdmin.expects(AdminMedia.uploadFileButton).toBeVisible();
    await ShopAdmin.expects(AdminMedia.searchInput).toBeVisible();
    await ShopAdmin.expects(AdminMedia.addNewFolderButton).toBeVisible();
    
    await ShopAdmin.expects(AdminDashboard.adminMenuUserActions).toBeVisible();
    await AdminDashboard.adminMenuUserActions.click();
    await ShopAdmin.expects(AdminDashboard.adminMenuLogoutButton).toBeVisible();
});
