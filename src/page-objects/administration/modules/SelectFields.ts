import { type Page, type Locator } from '@playwright/test';

export class SelectFieldLocators {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Returns the locator for a list item on a select field's result list.
     *
     * @param selectField - Locator for the select field.
     * @param listItem - List item to select.
     * @returns The locator for the list item.
     */
    async getListitem(selectField: Locator, listItem: string){
        await selectField.click();
        await this.page.locator('.sw-select-result-list__item-list').waitFor({ state: 'visible' });
        return this.page.locator('.sw-select-result-list__content').getByRole('listitem').filter({ hasText: listItem });
    }
}