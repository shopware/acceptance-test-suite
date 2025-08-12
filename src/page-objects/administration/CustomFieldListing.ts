import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CustomFieldListing implements PageObject {
    public readonly addNewSetButton: Locator;
    public readonly customFieldRows: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.addNewSetButton = page.getByText('Add new set');
        this.customFieldRows = page.getByRole('row');
    }

    async getLineItemByCustomFieldSetName(customFieldSetName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole('row').filter({ hasText: customFieldSetName });
        const customFieldSetNameText = lineItem.getByText(customFieldSetName);
        const customFieldSetContextButton = lineItem.locator('.sw-context-button__button');
        const customFieldSetEditButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Edit'});
        const customFieldSetDeleteButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Delete'});
        const warningDialog = this.page.getByRole('dialog', { name: 'Warning' });
        const warningDialogCancelButton = warningDialog.getByRole('button', { name: 'Cancel' });
        const warningDialogDeleteButton = warningDialog.getByRole('button', { name: 'Delete' });

        return {
            customFieldSetNameText: customFieldSetNameText,
            customFieldSetContextButton: customFieldSetContextButton,
            customFieldSetEditButton: customFieldSetEditButton,
            customFieldSetDeleteButton: customFieldSetDeleteButton,
            warningDialog: warningDialog,
            warningDialogCancelButton: warningDialogCancelButton,
            warningDialogDeleteButton: warningDialogDeleteButton,
        }
    }

    url() {
        return `#/sw/settings/custom/field/index`
    }
}