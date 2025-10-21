import { test, translate } from '../../src';

test('Administration page objects - General.', async ({
    InstanceMeta,
    ShopAdmin,
    AdminDashboard,
    AdminCategories,
    AdminLandingPageCreate,
    TestDataService,
    AdminOrderDetail,
    AdminProductDetail,
    AdminMedia,
    AdminOrderListing,
}) => {

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

    await ShopAdmin.goesTo(AdminOrderListing.url());
    await ShopAdmin.expects(AdminOrderListing.addOrderButton).toBeVisible();

    const orderLineItemRow = await AdminOrderListing.getLineItemByOrderNumber(order.orderNumber);
    await ShopAdmin.expects(orderLineItemRow.orderNumberText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderCustomerNameText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderDeliveryAddressText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderTotalAmountText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderStateText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderPaymentStateText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderDeliveryStateText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderDateText).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderCheckbox).toBeVisible();
    await ShopAdmin.expects(orderLineItemRow.orderContextButton).toBeVisible();

    await ShopAdmin.goesTo(AdminOrderDetail.url(order.id));
    await ShopAdmin.expects(AdminOrderDetail.saveButton).toBeVisible();
    await ShopAdmin.expects(AdminOrderDetail.dataGridContextButton).toBeVisible();
    await ShopAdmin.expects(AdminOrderDetail.itemsCardHeader).toContainText(translate('administration:order:detail.items'));

    await ShopAdmin.goesTo(AdminProductDetail.url(product.id));
    await ShopAdmin.expects(AdminProductDetail.savePhysicalProductButton).toBeVisible();
    await ShopAdmin.expects(AdminProductDetail.stockInput).toBeVisible();

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
