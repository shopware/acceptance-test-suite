import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class ManufacturerListing implements PageObject {
    public readonly addManufacturerButton: Locator;
    public readonly manufacturerRows: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.addManufacturerButton = page.getByText('Add manufacturer');
        this.manufacturerRows = page.getByRole('row');
    }

    async getLineItemByManufacturerName(manufacturerName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole('row').filter({ hasText: manufacturerName });
        const manufacturerNameText = lineItem.getByText(manufacturerName);
        const manufacturerWebsiteText = lineItem.locator('.sw-data-grid__cell--link');
        const manufacturerCheckbox = lineItem.locator('.sw-data-grid__cell--selection');
        const manufacturerContextButton = lineItem.locator('.sw-context-button__button');
        const manufacturerEditButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Edit'});
        const manufacturerDeleteButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Delete'});
        const warningDialog = this.page.getByRole('dialog', { name: 'Warning' });
        const warningDialogCancelButton = warningDialog.getByRole('button', { name: 'Cancel' });
        const warningDialogDeleteButton = warningDialog.getByRole('button', { name: 'Delete' });

        return {
            manufacturerNameText: manufacturerNameText,
            manufacturerWebsiteText: manufacturerWebsiteText,
            manufacturerCheckbox: manufacturerCheckbox,
            manufacturerContextButton: manufacturerContextButton,
            manufacturerEditButton: manufacturerEditButton,
            manufacturerDeleteButton: manufacturerDeleteButton,
            warningDialog: warningDialog,
            warningDialogCancelButton: warningDialogCancelButton,
            warningDialogDeleteButton: warningDialogDeleteButton,
        }
    }

    url() {
        return `#/sw/manufacturer/index`
    }
}