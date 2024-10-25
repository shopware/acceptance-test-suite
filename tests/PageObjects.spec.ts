import { test, getFlowId, isSaaSInstance, expect } from '../src/index';

test('Storefront page objects.', async ({
    ShopCustomer,
    ProductData,
    CategoryData,
    Login,
    AddProductToCart,
    ConfirmTermsAndConditions,
    SubmitOrder,
    StorefrontProductDetail,
    StorefrontCategory,
    StorefrontCheckoutCart,
    StorefrontCheckoutConfirm,
    StorefrontCheckoutFinish,
    StorefrontAccount,
    StorefrontAccountLogin,
    StorefrontAccountProfile,
    StorefrontAccountOrder,
    StorefrontAccountAddresses,
    StorefrontAccountPayment,
    StorefrontSearch,
}) => {

    await ShopCustomer.goesTo(StorefrontAccountLogin.url());
    await ShopCustomer.expects(StorefrontAccountLogin.loginButton).toBeVisible();
    await ShopCustomer.attemptsTo(Login());

    await ShopCustomer.goesTo(StorefrontProductDetail.url(ProductData));
    await ShopCustomer.expects(StorefrontProductDetail.addToCartButton).toBeVisible();
    await ShopCustomer.attemptsTo(AddProductToCart(ProductData));

    await ShopCustomer.goesTo(StorefrontCategory.url(CategoryData.name));
    await ShopCustomer.expects(StorefrontCategory.sortingSelect).toBeVisible();

    await ShopCustomer.goesTo(StorefrontCheckoutCart.url());
    await ShopCustomer.expects(StorefrontCheckoutCart.grandTotalPrice).toBeVisible();

    await ShopCustomer.goesTo(StorefrontCheckoutConfirm.url());
    await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeVisible();

    await ShopCustomer.attemptsTo(ConfirmTermsAndConditions());
    await ShopCustomer.attemptsTo(SubmitOrder());
    await ShopCustomer.expects(StorefrontCheckoutFinish.headline).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccount.url());
    await ShopCustomer.expects(StorefrontAccount.headline).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountOrder.url());
    await ShopCustomer.expects(StorefrontAccountOrder.orderExpandButton).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountProfile.url());
    await ShopCustomer.expects(StorefrontAccountProfile.changeEmailButton).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountPayment.url());
    await ShopCustomer.expects(StorefrontAccountPayment.changeDefaultPaymentButton).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountAddresses.url());
    await ShopCustomer.expects(StorefrontAccountAddresses.addNewAddressButton).toBeVisible();

    const searchTerm = 'product';
    await ShopCustomer.goesTo(StorefrontSearch.url(searchTerm));
    await ShopCustomer.expects(StorefrontSearch.headline).toBeVisible();
});

test('Administration page objects.', async ({
    InstanceMeta,
    AdminApiContext,
    ShopAdmin,
    ProductData,
    OrderData,
    DefaultSalesChannel,
    AdminProductDetail,
    AdminOrderDetail,
    AdminCustomerDetail,
    AdminFirstRunWizard,
    AdminFlowBuilderCreate,
    AdminFlowBuilderListing,
    AdminFlowBuilderDetail,
    AdminDataSharing,
    AdminDashboard,
    AdminCategories,
    AdminLandingPageCreate,
}) => {
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!await isSaaSInstance(AdminApiContext)) {
        await ShopAdmin.goesTo(AdminFirstRunWizard.url());
        await ShopAdmin.expects(AdminFirstRunWizard.nextButton).toBeVisible();
    }

    await ShopAdmin.goesTo(AdminProductDetail.url(ProductData.id));
    await ShopAdmin.expects(AdminProductDetail.savePhysicalProductButton).toBeVisible();

    await ShopAdmin.goesTo(AdminOrderDetail.url(OrderData.id));
    await ShopAdmin.expects(AdminOrderDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerDetail.url(DefaultSalesChannel.customer.id));
    await ShopAdmin.expects(AdminCustomerDetail.accountCard).toBeVisible();

    await ShopAdmin.goesTo(AdminFlowBuilderCreate.url());
    await ShopAdmin.expects(AdminFlowBuilderCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
    await ShopAdmin.expects(AdminFlowBuilderListing.createFlowButton).toBeVisible();

    const flowId = await getFlowId('Order enters status unconfirmed', AdminApiContext);
    await ShopAdmin.goesTo(AdminFlowBuilderDetail.url(flowId));
    await ShopAdmin.expects(AdminFlowBuilderDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCategories.url());
    await ShopAdmin.expects(AdminCategories.landingPageHeadline).toBeVisible();

    await ShopAdmin.goesTo(AdminLandingPageCreate.url());
    await ShopAdmin.expects(AdminLandingPageCreate.saveLandingPageButton).toBeVisible();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!InstanceMeta.isSaaS) {
        await ShopAdmin.goesTo(AdminDashboard.url());
        await ShopAdmin.expects(AdminDashboard.welcomeHeadline).toBeVisible();

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (!InstanceMeta.version.match(/6\.5\.*/)) {
            await ShopAdmin.goesTo(AdminDataSharing.url());
            await ShopAdmin.expects(AdminDataSharing.dataConsentHeadline).toBeVisible();
        }
    }
});

test('page is the same as AdminPage', async ({
    page, AdminPage,
}) => {
    expect(page).toBe(AdminPage);
});

test('context is the same as AdminPage.context()', async ({
    context, AdminPage,
}) => {
    expect(context).toBe(AdminPage.context());
});