import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import { extractIdFromUrl } from "../../../services/ShopwareDataHelpers";

const PRODUCT_DETAIL_URL_PATTERN = /#\/sw\/product\/detail\/(?<productId>[0-9a-f]{32})\//;

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

                await page.waitForURL(PRODUCT_DETAIL_URL_PATTERN);

                const duplicateId = PRODUCT_DETAIL_URL_PATTERN.exec(page.url())?.groups?.["productId"];
                TestDataService.addCreatedRecord("product", duplicateId as string);
            };
        };

        await use(task);
    },
});
