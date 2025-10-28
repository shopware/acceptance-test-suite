import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class ManufacturerListing implements PageObject {
    public readonly addManufacturerButton: Locator;
    public readonly manufacturerRows: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.addManufacturerButton = page.getByText(translate('administration:manufacturer:listing.addManufacturer'));
        this.manufacturerRows = page.getByRole('row');
    }

    async getLineItemByManufacturerName(manufacturerName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole('row').filter({ hasText: manufacturerName });
        const manufacturerNameText = lineItem.getByText(manufacturerName);
        const manufacturerWebsiteText = lineItem.locator('.sw-data-grid__cell--link');
        const manufacturerCheckbox = lineItem.locator('.sw-data-grid__cell--selection');
        const manufacturerContextButton = lineItem.locator('.sw-context-button__button');
        const manufacturerEditButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: translate('administration:manufacturer:actions.edit') });
        const manufacturerDeleteButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: translate('administration:manufacturer:actions.delete') });
        const warningDialog = this.page.getByRole('dialog', { name: translate('administration:manufacturer:dialogs.warning') });
        const warningDialogCancelButton = warningDialog.getByRole('button', { name: translate('administration:manufacturer:actions.cancel') });
        const warningDialogDeleteButton = warningDialog.getByRole('button', { name: translate('administration:manufacturer:actions.delete') });

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
        };
    }

    url() {
        return `#/sw/manufacturer/index`;
    }
}
