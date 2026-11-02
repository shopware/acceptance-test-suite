import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Deletes a product from the product listing and confirms the warning modal.
 *
 * Expects the listing to be open and filtered down to the product, so that the row
 * of the given product number is the one being acted on.
 */
export const DeleteProduct = base.extend<{ DeleteProduct: Task }, FixtureTypes>({
    DeleteProduct: async ({ AdminProductListing }, use) => {
        const task = (productNumber: string) => {
            return async function DeleteProduct() {
                const page = AdminProductListing.page;
                const productRow = await AdminProductListing.getProductRow(productNumber);

                await productRow["actionsMenuButton"].click();
                await AdminProductListing.deleteContextMenuItem.click();

                const deleteRequest = page.waitForResponse((response) => response.request().method() === "DELETE" && response.url().includes("/api/product/"));
                await AdminProductListing.confirmDeleteButton.click();
                const deleteResponse = await deleteRequest;

                expect(deleteResponse.ok()).toBeTruthy();
            };
        };

        await use(task);
    },
});
