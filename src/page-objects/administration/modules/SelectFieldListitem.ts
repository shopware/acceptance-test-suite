import { type Page, type Locator } from '@playwright/test';
import { HelperFixtureTypes } from '../../../fixtures/HelperFixtures';

    /**
     * Returns the locator for a list item on a select field's result list.
     *
     * @param page - The Playwright page object.
     * @param selectField - Locator for the select field.
     * @param listItem - List item to select.
     * @returns The locator for the list item.
     */
    export async function getSelectFieldListitem(page: Page, selectField: Locator, listItem: string, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        await selectField.click();
        await page.locator('.sw-select-result-list__item-list').waitFor({ state: 'visible' });
        return page.locator('.sw-select-result-list__content').getByRole('listitem').filter({ hasText: listItem });
}