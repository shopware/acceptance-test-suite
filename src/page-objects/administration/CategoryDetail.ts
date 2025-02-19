import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CategoryDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;

    constructor(public readonly page: Page) {
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.customFieldCard = page.locator('.mt-card').getByText('Custom fields');
        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {

        const customFieldCard = this.page.locator('.mt-card').filter({ hasText: 'Custom fields' });
        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        }
    }

    url(categoryUuid: string) {
        return `#/sw/category/index/${categoryUuid}/base`
    }
}