import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import { Product } from 'src/types/ShopwareTypes';

export const BulkEditProducts = base.extend<{ BulkEditProducts: Task }, FixtureTypes>({
    BulkEditProducts: async ({ ShopAdmin, AdminProductBulkEdit, AdminProductListing }, use ) => {
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
                        if (await AdminProductBulkEdit.activeToggle.isChecked() != false) {
                            await AdminProductBulkEdit.changeActiveCheckbox.click();
                            await AdminProductBulkEdit.activeToggle.click();
                        }; 
                    } else {
                        if (await AdminProductBulkEdit.activeToggle.isChecked() != true) {
                            await AdminProductBulkEdit.changeActiveCheckbox.click();
                            await AdminProductBulkEdit.activeToggle.click();
                        }; 
                    }; 
                } 
                
                await AdminProductBulkEdit.applyChangesButton.click();
                await AdminProductBulkEdit.confirmModalApplyChangesButton.click();
                await ShopAdmin.expects(AdminProductBulkEdit.confirmModalSuccessHeader).toBeVisible();
                await AdminProductBulkEdit.confirmModalSuccessCloseButton.click();
            }
        }

        await use(task);
    },
});