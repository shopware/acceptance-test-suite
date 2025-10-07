import { test } from '../../src';

test('Administration page objects - Customer.', async ({
    ShopAdmin,
    AdminCustomerListing,
    AdminCustomerDetail,
    TestDataService,
    }) => {

    const customer = await TestDataService.createCustomer();

    await ShopAdmin.goesTo(AdminCustomerListing.url());
    await ShopAdmin.expects(AdminCustomerListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerListing.addCustomerButton).toBeVisible();

    const customerRow = await AdminCustomerListing.getCustomerByEmail(customer.email);
    await ShopAdmin.expects(customerRow.customerName).toHaveText(`${customer.lastName}, ${customer.firstName}`);
    await ShopAdmin.expects(customerRow.customerStreet).toHaveText(customer.defaultBillingAddress.street);
    await ShopAdmin.expects(customerRow.customerPostalCode).toHaveText(customer.defaultBillingAddress.zipcode);
    await ShopAdmin.expects(customerRow.customerCity).toHaveText(customer.defaultBillingAddress.city);
    await ShopAdmin.expects(customerRow.customerNumber).toHaveText(customer.customerNumber);

    await ShopAdmin.goesTo(AdminCustomerDetail.url(customer.id));
    await ShopAdmin.expects(AdminCustomerDetail.accountCard).toBeVisible({ timeout: 15_000 });
});
