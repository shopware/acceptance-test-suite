import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Duplicates a product from the product listing row context menu and waits until the duplicate is opened.
 *
 * Expects the listing to be open and filtered down to the product, so that the row
 * of the given product number is the one being acted on. The duplicate is registered for test data cleanup.
 */
export const DuplicateProduct = base.extend<{ DuplicateProduct: Task }, FixtureTypes>({
    DuplicateProduct: async ({ AdminProductListing, TestDataService }, use) => {
        const task = (productNumber: string) => {
            return async function DuplicateProduct() {
                const page = AdminProductListing.page;
                const productRow = await AdminProductListing.getProductRow(productNumber);

                await productRow["actionsMenuButton"].click();

                const cloneRequest = page.waitForResponse((response) => response.url().includes("/api/_action/clone/product/"));
                await AdminProductListing.duplicateContextMenuItem.click();
                const cloneResponse = await cloneRequest;

                expect(cloneResponse.ok()).toBeTruthy();

                const { id: duplicateId } = (await cloneResponse.json()) as { id: string };
                TestDataService.addCreatedRecord("product", duplicateId);

                await page.waitForURL(new RegExp(`#/sw/product/detail/${duplicateId}/`));
            };
        };

        await use(task);
    },
});
