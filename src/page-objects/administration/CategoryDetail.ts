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
        this.customFieldCard = page.locator('.sw-card').getByText('Custom fields');
        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
    }

    url(categoryUuid: string) {
        return `#/sw/category/index/${categoryUuid}/base`
    }
}