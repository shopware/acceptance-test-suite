import { satisfies } from 'compare-versions';
import { test } from '../../src';

test('Storefront page objects', async ({
    ShopCustomer,
    AddProductToCart,
    StorefrontProductDetail,
    Login,
    ConfirmTermsAndConditions,
    SubmitOrder,
    StorefrontCheckoutCart,
    StorefrontCheckoutConfirm,
    StorefrontCheckoutFinish,
    StorefrontAccount,
    StorefrontAccountLogin,
    StorefrontAccountProfile,
    StorefrontAccountOrder,
    StorefrontAccountAddresses,
    StorefrontAccountPayment,
    StorefrontCategory,
    StorefrontSearch,
    TestDataService,
    InstanceMeta,
    CheckVisibilityInHome,
    StorefrontHome,
}) => {

    const product = await TestDataService.createBasicProduct();
    const category = await TestDataService.createCategory();
    await TestDataService.assignProductCategory(product.id, category.id);

    await ShopCustomer.goesTo(StorefrontHome.url())
    await ShopCustomer.attemptsTo(CheckVisibilityInHome(product.name));
    await ShopCustomer.expects(StorefrontHome.categoryTitle).toBeVisible();

    await ShopCustomer.goesTo(StorefrontCategory.url(category.name));
    await ShopCustomer.expects(StorefrontCategory.sortingSelect).toBeVisible();

    const searchTerm = 'product';
    await ShopCustomer.goesTo(StorefrontSearch.url(searchTerm));
    await ShopCustomer.expects(StorefrontSearch.headline).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountLogin.url());
    await ShopCustomer.expects(StorefrontAccountLogin.loginButton).toBeVisible();
    await ShopCustomer.attemptsTo(Login());

    await ShopCustomer.goesTo(StorefrontProductDetail.url(product));
    await ShopCustomer.expects(StorefrontProductDetail.addToCartButton).toBeVisible();
    await ShopCustomer.attemptsTo(AddProductToCart(product));

    await ShopCustomer.goesTo(StorefrontCheckoutCart.url());
    await ShopCustomer.expects(StorefrontCheckoutCart.grandTotalPrice).toBeVisible();

    await ShopCustomer.goesTo(StorefrontCheckoutConfirm.url());
    await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeVisible();

    await ShopCustomer.attemptsTo(ConfirmTermsAndConditions());
    await ShopCustomer.attemptsTo(SubmitOrder());
    const orderId = StorefrontCheckoutFinish.getOrderId();
    TestDataService.addCreatedRecord('order', orderId);
    await ShopCustomer.expects(StorefrontCheckoutFinish.headline).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccount.url());
    await ShopCustomer.expects(StorefrontAccount.headline).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountOrder.url());
    await ShopCustomer.expects(StorefrontAccountOrder.orderExpandButton).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountProfile.url());
    await ShopCustomer.expects(StorefrontAccountProfile.changeEmailButton).toBeVisible();

    await ShopCustomer.goesTo(StorefrontAccountAddresses.url());
    await ShopCustomer.expects(StorefrontAccountAddresses.addNewAddressButton).toBeVisible();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (satisfies(InstanceMeta.version, '<6.7')) {
        await ShopCustomer.goesTo(StorefrontAccountPayment.url());
        await ShopCustomer.expects(StorefrontAccountPayment.changeDefaultPaymentButton).toBeVisible();
    }

});