import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const BulkEditProduct = base.extend<{ BulkEditProduct: Task }, FixtureTypes>({
    BulkEditProduct: async ({ ShopAdmin, AdminProductBulkEdit, AdminProductListing }, use ) => {
        const task = () => {
            return async function BulkEditProduct() {
            const product1TableRow = await AdminProductListing.getProductRow(product1.productNumber);
            await product1TableRow.selectionCheckbox.click();
            const product2TableRow = await AdminProductListing.getProductRow(product2.productNumber);
            await product2TableRow.selectionCheckbox.click();

            await AdminProductListing.bulkEditButton.click();
            await AdminProductListing.startBulkEditButton.click();
            await AdminProductBulkEdit.changePriceCheckbox.click();
            await AdminProductBulkEdit.grossPriceInput.fill(changedProductPrice);
            await AdminProductBulkEdit.applyChangesButton.click();
            await AdminProductBulkEdit.confirmModalApplyChangesButton.click();
            await ShopAdmin.expects(AdminProductBulkEdit.confirmModalSuccessHeader).toBeVisible();
            await AdminProductBulkEdit.confirmModalSuccessCloseButton.click();
            }
        }

        await use(task);
    },
});