import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ProductBulkEdit implements PageObject {

    /**
     * Bulk edit values
     */
    public readonly changePriceRow: Locator;
    public readonly changePriceCheckbox: Locator;
    public readonly grossPriceInput: Locator;
    public readonly applyChangesButton: Locator;

    /**
     * Confirmation modal
     */
    public readonly confirmModal: Locator;
    public readonly confirmModalApplyChangesButton: Locator;
    public readonly confirmModalSuccessHeader: Locator;
    public readonly confirmModalSuccessCloseButton: Locator;

    constructor(public readonly page: Page) {

        this.changePriceRow = page.locator('.sw-bulk-edit-change-field-price');
        this.changePriceCheckbox = this.changePriceRow.getByRole('checkbox');
        this.grossPriceInput = this.changePriceRow.getByRole('textbox', {name: 'price-gross'});
        this.applyChangesButton = page.getByRole('button', {name: 'Apply changes'});

        this.confirmModal = page.locator('.sw-bulk-edit-save-modal');
        this.confirmModalApplyChangesButton = this.confirmModal.getByRole('button', {name: 'Apply changes'});
        this.confirmModalSuccessHeader = this.confirmModal.getByRole('heading', {name: 'Bulk edit - Success'});
        this.confirmModalSuccessCloseButton = this.confirmModal.getByRole('button', {name: 'Close'});
    }

    url() {
        // Bulk edit page does not have a URL, but the class needs a URL method.
        throw new Error('Bulk edit page does not have a callable URL.');
        return '';
    }
}