import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import { Product } from 'src/types/ShopwareTypes';

export const BulkEditProducts = base.extend<{ BulkEditProducts: Task }, FixtureTypes>({
    BulkEditProducts: async ({ AdminProductBulkEdit, AdminProductListing }, use ) => {
        const task = (products: Product[], changes: Record<string, string> ) => {
            return async function BulkEditProducts() {

                for (const product of products) {
                    const productTableRow = await AdminProductListing.getProductRow(product.productNumber);
                    await productTableRow.selectionCheckbox.click();
                }

                await AdminProductListing.bulkEditButton.click();
                await AdminProductListing.startBulkEditButton.click();

                if (changes['grossPrice'] != '') {
                    await AdminProductBulkEdit.changePriceCheckbox.click();
                    await AdminProductBulkEdit.grossPriceInput.fill(changes['grossPrice']);
                }

                if (changes['active'] != '') {
                    if (changes['active'] == 'false') {
                        await AdminProductBulkEdit.changeActiveCheckbox.click();
                    } else {
                        await AdminProductBulkEdit.changeActiveCheckbox.click();
                        await AdminProductBulkEdit.activeToggle.click();
                    }
                }

                if (changes['manufacturer'] != '') {
                    await AdminProductBulkEdit.changeManufacturerCheckbox.click();
                    await AdminProductBulkEdit.manufacturerDropdown.click();
                    const responsePromise = AdminProductBulkEdit.page.waitForResponse(response =>
                        response.url().includes(`product-manufacturer`) && response.status() === 200 && response.request().method() === 'POST'
                    );

                    await AdminProductBulkEdit.manufacturerDropdownInput.fill(changes['manufacturer']);

                    // Wait for the search call to be completed
                    const response = await responsePromise;
                    expect(response.ok()).toBeTruthy();

                    //await AdminProductBulkEdit.manufacturerDropdownInput.press('Enter');
                    const searchResult = await AdminProductBulkEdit.getManufacturerSearchResult(changes['manufacturer']);
                    await searchResult.click();
                } 

                await AdminProductBulkEdit.applyChangesButton.click();
                await AdminProductBulkEdit.confirmModalApplyChangesButton.click();
                await expect(AdminProductBulkEdit.confirmModalSuccessHeader).toBeVisible();
                await AdminProductBulkEdit.confirmModalSuccessCloseButton.click();
            };
        };

        await use(task);
    },
});