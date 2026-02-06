import type { Page, Locator } from "playwright-core";
import type { HelperFixtureTypes } from "../../../fixtures/HelperFixtures";
import { satisfies } from "compare-versions";

/**
 * Returns the locator for a list item on a select field's result list.
 *
 * @param page - The Playwright page object.
 * @param selectField - Locator for the select field.
 * @param listItem - List item to select.
 * @param instanceMeta - Compatibility with current and last major version.
 * @returns The locator for the list item.
 */
export async function getSelectFieldListitem(page: Page, selectField: Locator, listItem: string, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
    await selectField.click();
    if (satisfies(instanceMeta.version, "<6.7")) {
        await page.locator(".sw-select-result-list__item-list").waitFor({ state: "visible" });
        return page.locator(".sw-select-result-list__content").getByRole("listitem").filter({ hasText: listItem });
    } else {
        await page.locator(".mt-select-result-list__item-list").waitFor({ state: "visible" });
        return page.locator(".mt-select-result-list__item-list").getByRole("listitem").filter({ hasText: listItem });
    }
}
