import { test } from '../../src';

test('Administration page objects - CustomerGroup.', async ({
    ShopAdmin,
    AdminCustomerGroupListing,
    AdminCustomerGroupCreate,
    AdminCustomerGroupDetail,
    TestDataService,
}) => {

    const customerGroup = await TestDataService.createCustomerGroup();

    await ShopAdmin.goesTo(AdminCustomerGroupListing.url());
    await ShopAdmin.expects(AdminCustomerGroupListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupListing.addCustomerGroupButton).toBeVisible();
    const customerGroupRow = await AdminCustomerGroupListing.getCustomerGroupByName(customerGroup.name);
    await ShopAdmin.expects(customerGroupRow.customerGroupName).toHaveText(customerGroup.name);

    await ShopAdmin.goesTo(AdminCustomerGroupDetail.url(customerGroup.id));
    await ShopAdmin.expects(AdminCustomerGroupDetail.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupDetail.saveButton).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupDetail.customerGroupNameField).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupCreate.url());
    await ShopAdmin.expects(AdminCustomerGroupCreate.customerGroupNameField).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupCreate.saveButton).toBeVisible();

});
