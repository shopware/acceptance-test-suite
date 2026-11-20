import { test as base, expect } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

/**
 * Duplicates a promotion from the listing and waits until the inactive copy is opened.
 *
 * The promotion listing must already be open. The copy is registered for cleanup.
 */
export const DuplicatePromotion = base.extend<{ DuplicatePromotion: Task }, FixtureTypes>({
    DuplicatePromotion: async ({ AdminPromotionsListing, TestDataService }, use) => {
        const task = (promotionName: string) => {
            return async function DuplicatePromotion() {
                const page = AdminPromotionsListing.page;
                const promotionRow = await AdminPromotionsListing.getPromotionRow(promotionName);

                await promotionRow.promotionContextButton.click();

                const cloneRequest = page.waitForResponse((response) => response.url().includes("/api/_action/clone/promotion/") && response.request().method() === "POST");
                await promotionRow.promotionContextMenuDuplicateButton.click();
                const cloneResponse = await cloneRequest;

                expect(cloneResponse.ok()).toBeTruthy();

                const { id: cloneId } = (await cloneResponse.json()) as { id: string };
                TestDataService.addCreatedRecord("promotion", cloneId);

                await page.waitForURL(new RegExp(`#/sw/promotion/v2/detail/${cloneId}`));
            };
        };

        await use(task);
    },
});
