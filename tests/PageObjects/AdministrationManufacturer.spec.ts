import { test } from '../../src';

test('Administration page objects - Manufacturer.', async ({
    TestDataService,
    ShopAdmin,
    AdminManufacturerListing,
    AdminManufacturerCreate,
}) => {

    const manufacturer = await TestDataService.createBasicManufacturer();

    await ShopAdmin.goesTo(AdminManufacturerListing.url());
    await ShopAdmin.expects(AdminManufacturerListing.addManufacturerButton).toBeVisible();
    const manufacturerRow = await AdminManufacturerListing.getLineItemByManufacturerName(manufacturer.name);
    await ShopAdmin.expects(manufacturerRow.manufacturerNameText).toHaveText(manufacturer.name);

    await ShopAdmin.goesTo(AdminManufacturerCreate.url());
    await ShopAdmin.expects(AdminManufacturerCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminManufacturerCreate.saveButton).toBeVisible();
});
