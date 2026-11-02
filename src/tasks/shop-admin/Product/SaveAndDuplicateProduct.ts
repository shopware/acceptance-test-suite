import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import { extractIdFromUrl } from "../../../services/ShopwareDataHelpers";

/**
 * Saves the currently open product via "Save and duplicate" and waits until the duplicate is opened.
 *
 * Works on the product creation form as well as on the detail page of an existing product.
 * Both the saved product and its duplicate are registered for test data cleanup.
 */
export const SaveAndDuplicateProduct = base.extend<{ SaveAndDuplicateProduct: Task }, FixtureTypes>({
    SaveAndDuplicateProduct: async ({ AdminProductDetail, TestDataService }, use) => {
        const task = () => {
            return async function SaveAndDuplicateProduct() {
                const page = AdminProductDetail.page;

                await AdminProductDetail.saveContextMenuButton.click();

                const cloneRequest = page.waitForResponse((response) => response.url().includes("/api/_action/clone/product/"));
                await AdminProductDetail.saveAndDuplicateButton.click();
                const cloneResponse = await cloneRequest;

                expect(cloneResponse.ok()).toBeTruthy();

                TestDataService.addCreatedRecord("product", extractIdFromUrl(cloneResponse.url()) as string);

                // Take the duplicate id from the clone response. On an existing product the page is already on
                // a detail URL, so reading the id from the URL could return the original instead of the duplicate.
                const { id: duplicateId } = (await cloneResponse.json()) as { id: string };
                TestDataService.addCreatedRecord("product", duplicateId);

                await page.waitForURL(new RegExp(`#/sw/product/detail/${duplicateId}/`));
            };
        };

        await use(task);
    },
});
