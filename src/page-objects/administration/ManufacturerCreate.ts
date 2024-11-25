import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ManufacturerCreate implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly nameInput: Locator;
    public readonly websiteInput: Locator;
    public readonly descriptionInput: Locator;

    constructor(public readonly page: Page) {
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.nameInput = page.getByLabel('Name');
        this.websiteInput = page.getByLabel('Website');
        this.descriptionInput = page.locator('.sw-text-editor__content-editor');
    }

    url() {
        return `#/sw/manufacturer/create`
    }
}