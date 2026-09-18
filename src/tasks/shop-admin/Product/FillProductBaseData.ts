import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import type { ProductFormData } from "../../../types/ShopwareTypes";

/**
 * Fills the base data of the administration product creation form.
 *
 * The form is left unsaved so that the caller can decide between "Save" and "Save and duplicate".
 */
export const FillProductBaseData = base.extend<{ FillProductBaseData: Task }, FixtureTypes>({
    FillProductBaseData: async ({ AdminProductCreate, ShopAdmin }, use) => {
        const task = (product: ProductFormData) => {
            return async function FillProductBaseData() {
                await ShopAdmin.fillsIn(AdminProductCreate.nameInput, product.name);

                // The net price is derived server side, so saving too early would persist a stale price.
                const priceCalculation = AdminProductCreate.page.waitForResponse((response) => response.url().includes("/api/_action/calculate-price") && response.ok());
                await ShopAdmin.fillsIn(AdminProductCreate.priceGrossInput, product.grossPrice);
                await priceCalculation;
            };
        };

        await use(task);
    },
});
