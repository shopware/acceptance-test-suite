import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SaveProduct = base.extend<{ SaveProduct: Task }, FixtureTypes>({
    SaveProduct: async ({ ShopAdmin, AdminProductDetail }, use ) => {
        const task = () => {
            return async function SaveProduct() {

                await AdminProductDetail.savePhysicalProductButton.click();

                // Wait until product is saved via API
                const response = await AdminProductDetail.page.waitForResponse(`${process.env['APP_URL']}api/_action/sync`);

                // Assertions
                expect(response.ok()).toBeTruthy();
                await ShopAdmin.expects(AdminProductDetail.savePhysicalProductButton).toBeVisible();
                await ShopAdmin.expects(AdminProductDetail.savePhysicalProductButton).toContainText('Save');
                await ShopAdmin.expects(AdminProductDetail.saveButtonCheckMark).toBeHidden();
                await ShopAdmin.expects(AdminProductDetail.saveButtonLoadingSpinner).toBeHidden();
                await ShopAdmin.expects(AdminProductDetail.page.getByText('The following error occurred:')).toBeHidden();
            }
        }

        await use(task);
    },
});