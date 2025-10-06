import { test } from '../../src';

test('Administration page objects - Manufacturer.', async ({
    ShopAdmin,
    AdminManufacturerListing,
    AdminManufacturerCreate,
    }) => {

    await ShopAdmin.goesTo(AdminManufacturerListing.url());
    await ShopAdmin.expects(AdminManufacturerListing.addManufacturerButton).toBeVisible();

    await ShopAdmin.goesTo(AdminManufacturerCreate.url());
    await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminManufacturerCreate.saveButton).toBeVisible();

});
