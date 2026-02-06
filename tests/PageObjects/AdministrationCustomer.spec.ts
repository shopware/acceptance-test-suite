import { test } from "../../src";

test("Administration page objects - Customer.", async ({ ShopAdmin, AdminCustomerListing, AdminCustomerDetail, TestDataService }) => {
    const customer = await TestDataService.createCustomer();

    await ShopAdmin.goesTo(AdminCustomerListing.url());
    await ShopAdmin.expects(AdminCustomerListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerListing.addCustomerButton).toBeVisible();
    const customerRow = await AdminCustomerListing.getCustomerByEmail(customer.email);
    await ShopAdmin.expects(customerRow.customerEmailAddress).toHaveText(customer.email);

    await ShopAdmin.goesTo(AdminCustomerDetail.url(customer.id));
    await ShopAdmin.expects(AdminCustomerDetail.generalTab).toBeVisible();
    await ShopAdmin.expects(AdminCustomerDetail.accountCard).toBeVisible({ timeout: 15_000 });
    await ShopAdmin.expects(AdminCustomerDetail.customerEmail).toBeVisible();
});
