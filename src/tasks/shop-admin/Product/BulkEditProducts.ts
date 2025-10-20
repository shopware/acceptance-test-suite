import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { Product } from 'src/types/ShopwareTypes';

interface Change {
    value: string;
    method: string;
}

export const BulkEditProducts = base.extend<{ BulkEditProducts: Task }, FixtureTypes>({
    BulkEditProducts: async ({ AdminProductBulkEdit, AdminProductListing }, use) => {
        const task = (products: Product[], changes: Record<string, Change>) => {
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
                        response.url().includes(`product-manufacturer`) && response.status() === 200 && response.request().method() === 'POST',
                    );
                    await AdminProductBulkEdit.manufacturerDropdownInput.fill(changes['manufacturer'].value);

                    // Wait for the search call to be completed
                    const response = await responsePromise;
                    expect(response.ok()).toBeTruthy();
                    const searchResult = await AdminProductBulkEdit.getDropdownEntry(changes['manufacturer'].value);
                    await searchResult.click();
                }

                if (changes['releaseDate'] != null) {
                    await AdminProductBulkEdit.changeReleaseDateCheckbox.click();
                    await AdminProductBulkEdit.releaseDateInput.fill(changes['releaseDate'].value);
                    await AdminProductBulkEdit.releaseDateInput.press('Enter');
                }

                if (changes['stock'] != null) {
                    await AdminProductBulkEdit.changeStockCheckbox.click();
                    await AdminProductBulkEdit.stockChangeMethodDropdown.click();
                    await (await AdminProductBulkEdit.getDropdownEntry(changes['stock'].method)).click();
                    if (changes['stock'].method != 'Clear') {
                        await AdminProductBulkEdit.stockInput.fill(changes['stock'].value);
                    }
                }

                if (changes['restockTime'] != null) {
                    await AdminProductBulkEdit.changeRestockTimeCheckbox.click();
                    await AdminProductBulkEdit.restockTimeChangeMethodDropdown.click();
                    await (await AdminProductBulkEdit.getDropdownEntry(changes['restockTime'].method)).click();
                    if (changes['restockTime'].method != 'Clear') {
                        await AdminProductBulkEdit.restockTimeInput.fill(changes['restockTime'].value);
                    }
                }

                if (changes['tags'] != null) {
                    await AdminProductBulkEdit.changeTagsCheckbox.click();
                    await AdminProductBulkEdit.tagsChangeMethodDropdown.click();
                    await (await AdminProductBulkEdit.getDropdownEntry(changes['tags'].method)).click();
                    if (changes['tags'].method != 'Clear') {
                        await AdminProductBulkEdit.tagsInput.click();
                        const responsePromise = AdminProductBulkEdit.page.waitForResponse(response =>
                            response.url().includes(`search/tag`) && response.status() === 200 && response.request().method() === 'POST',
                        );
                        await AdminProductBulkEdit.tagsInput.fill(changes['tags'].value);

                        // Wait for the search call to be completed
                        const response = await responsePromise;
                        expect(response.ok()).toBeTruthy();
                        const searchResult = await AdminProductBulkEdit.getDropdownEntry(changes['tags'].value);
                        await searchResult.click();
                    }
                }

                if (changes['saleschannel'] != null) {
                    await AdminProductBulkEdit.changeSalesChannelCheckbox.click();
                    await AdminProductBulkEdit.salesChannelChangeMethodDropdown.click();
                    await (await AdminProductBulkEdit.getDropdownEntry(changes['saleschannel'].method)).click();
                    if (changes['saleschannel'].method != 'Clear') {
                        await AdminProductBulkEdit.salesChannelInput.click();
                        const responsePromise = AdminProductBulkEdit.page.waitForResponse(response =>
                            response.url().includes(`search/sales-channel`) && response.status() === 200 && response.request().method() === 'POST',
                        );
                        await AdminProductBulkEdit.salesChannelInput.fill(changes['saleschannel'].value);

                        // Wait for the search call to be completed
                        const response = await responsePromise;
                        expect(response.ok()).toBeTruthy();
                        const searchResult = await AdminProductBulkEdit.getDropdownEntry(changes['saleschannel'].value);
                        await searchResult.click();
                    }
                }

                await AdminProductBulkEdit.applyChangesButton.click();
                await AdminProductBulkEdit.confirmModalApplyChangesButton.click();
                await AdminProductBulkEdit.confirmModalLoadingSpinner.waitFor({ state: 'visible' });
                await AdminProductBulkEdit.confirmModalLoadingSpinner.waitFor({ state: 'hidden' });
                await expect(AdminProductBulkEdit.confirmModalSuccessHeader).toBeVisible();
                await AdminProductBulkEdit.confirmModalSuccessCloseButton.click();
            };
        };

        await use(task);
    },
});