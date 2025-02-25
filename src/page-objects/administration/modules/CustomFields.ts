import { type Page, type Locator } from '@playwright/test';

export class CustomFieldLocators {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Returns locators for assigned custom fields on entity detail pages.
     *
     * @param customFieldSetName
     * @param customFieldName
     * @returns Custom field locators on entity detail pages.
     */
    async getLocators(customFieldSetName: string, customFieldName: string): Promise<{ customFieldCard: Locator, customFieldSetTab: Locator, customFieldLabel: Locator, customFieldSelect: Locator }> {
        const customFieldCard = this.page.locator('.sw-card').filter({ hasText: 'Custom fields' });
        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldLabel = customFieldCard.locator('.sw-custom-field-set-renderer').locator('.sw-field__label').getByText(customFieldName);
        const customFieldSelect = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldCard,
            customFieldSetTab,
            customFieldLabel,
            customFieldSelect,
        };
    }
}