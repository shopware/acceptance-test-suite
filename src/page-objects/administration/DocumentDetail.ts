import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class DocumentDetail implements PageObject {

    public readonly showInAccountSwitch: Locator;
    public readonly saveButton: Locator;




    constructor(public readonly page: Page) {
        this.showInAccountSwitch = page.getByRole('checkbox', { name: 'Display document in "My' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
    }

    url(documentId: string) {
        return `#/sw/settings/document/detail/${documentId}`;
    }
}