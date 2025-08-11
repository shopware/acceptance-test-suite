import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class DocumentDetail implements PageObject {
    public readonly showInAccountSwitch: Locator;
    public readonly saveButton: Locator;
    public readonly documentTypeSelect: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.showInAccountSwitch = page.getByRole('checkbox', { name: 'Display document in "My' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.documentTypeSelect = page.locator('.sw-settings-document-detail__select-type');
    }

    url(documentId: string) {
        return `#/sw/settings/document/detail/${documentId}`;
    }
}