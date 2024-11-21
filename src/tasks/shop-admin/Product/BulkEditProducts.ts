import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import { Product } from 'src/types/ShopwareTypes';

interface Change {
    value: string;
    method: string;
} 

export const BulkEditProducts = base.extend<{ BulkEditProducts: Task }, FixtureTypes>({
    BulkEditProducts: async ({ AdminProductBulkEdit, AdminProductListing }, use ) => {
        const task = (products: Product[], changes: Record<string, Change> ) => {
            return async function BulkEditProducts() {

                for (const product of products) {
                    const productTableRow = await AdminProductListing.getProductRow(product.productNumber);
                    await productTableRow.selectionCheckbox.click();
                }

                await AdminProductListing.bulkEditButton.click();
                await AdminProductListing.startBulkEditButton.click();

                if (changes['grossPrice'] != null) {
                    await AdminProductBulkEdit.changePriceCheckbox.click();
                    await AdminProductBulkEdit.grossPriceInput.fill(changes['grossPrice'].value);
                }

                if (changes['active'] != null) {
                    if (changes['active'].value == 'false') {
                        await AdminProductBulkEdit.changeActiveCheckbox.click();
                    } else {
                        await AdminProductBulkEdit.changeActiveCheckbox.click();
                        await AdminProductBulkEdit.activeToggle.click();
                    }
                }

                if (changes['manufacturer'] != null) {
                    await AdminProductBulkEdit.changeManufacturerCheckbox.click();
                    await AdminProductBulkEdit.manufacturerDropdown.click();
                    const responsePromise = AdminProductBulkEdit.page.waitForResponse(response =>
                        response.url().includes(`product-manufacturer`) && response.status() === 200 && response.request().method() === 'POST'
                    );
                    await AdminProductBulkEdit.manufacturerDropdownInput.fill(changes['manufacturer'].value);

                    // Wait for the search call to be completed
                    const response = await responsePromise;
                    expect(response.ok()).toBeTruthy();
                    const searchResult = await AdminProductBulkEdit.getManufacturerSearchResult(changes['manufacturer'].value);
                    await searchResult.click();
                } 

                if (changes['releaseDate'] != null) {
                    await AdminProductBulkEdit.changeReleaseDateCheckbox.click();
                    await AdminProductBulkEdit.releaseDateInput.fill(changes['releaseDate'].value);
                }
                
                if (changes['stock'] != null) {
                    await AdminProductBulkEdit.changeStockCheckbox.click();
                    await AdminProductBulkEdit.stockChangeMethodDropdown.click();
                    await AdminProductBulkEdit.stockChangeMethodInput.fill(changes['stock'].method);
                    await AdminProductBulkEdit.stockInput.fill(changes['stock'].value);
                }

                if (changes['restockTime'] != null) {
                    await AdminProductBulkEdit.changeRestockTimeCheckbox.click();
                    await AdminProductBulkEdit.restockTimeChangeMethodDropdown.click();
                    await AdminProductBulkEdit.restockTimeChangeMethodInput.fill(changes['restockTime'].method);
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