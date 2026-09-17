import { test as base } from "@playwright/test";
import type { Locator } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const SelectExtensionCategory = base.extend<{ SelectExtensionCategory: Task }, FixtureTypes>({
    SelectExtensionCategory: async ({ AdminFirstRunWizard }, use) => {
        const task = (category: Locator) => {
            return async function SelectExtensionCategory() {
                const recommendationsLoaded = AdminFirstRunWizard.page.waitForResponse((response) => response.url().includes("/_action/store/recommendations") && response.ok());
                await category.click();
                await recommendationsLoaded;
            };
        };
        await use(task);
    },
});
