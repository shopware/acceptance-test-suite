import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ProductBulkEdit implements PageObject {

    /**
     * Bulk edit values
     */
    
    public readonly changeManufacturerRow: Locator;
    public readonly changeManufacturerCheckbox: Locator;
    public readonly manufacturerDropdown: Locator;
    public readonly manufacturerDropdownInput: Locator;
    public readonly manufacturerListResult: Locator;

    public readonly changeActiveRow: Locator;
    public readonly changeActiveCheckbox: Locator;
    public readonly activeToggle: Locator;
    
    public readonly changePriceRow: Locator;
    public readonly changePriceCheckbox: Locator;
    public readonly grossPriceInput: Locator;

    public readonly changeReleaseDateRow: Locator;
    public readonly changeReleaseDateCheckbox: Locator;
    public readonly releaseDateInput: Locator;

    public readonly changeStockRow: Locator;
    public readonly changeStockCheckbox: Locator;
    public readonly stockChangeMethodDropdown: Locator;
    public readonly stockChangeMethodInput: Locator;
    public readonly stockInput: Locator;

    public readonly changeRestockTimeRow: Locator;
    public readonly changeRestockTimeCheckbox: Locator;
    public readonly restockTimeChangeMethodDropdown: Locator;
    public readonly restockTimeChangeMethodInput: Locator;
    public readonly restockTimeInput: Locator;

    public readonly changeTagsRow: Locator;
    public readonly changeTagsCheckbox: Locator;
    public readonly tagsChangeMethodDropdown: Locator;
    public readonly tagsChangeMethodInput: Locator;
    public readonly tagsInput: Locator;

    public readonly changeSalesChannelRow: Locator;
    public readonly changeSalesChannelCheckbox: Locator;
    public readonly salesChannelChangeMethodDropdown: Locator;
    public readonly salesChannelChangeMethodInput: Locator;
    public readonly salesChannelInput: Locator;

    public readonly applyChangesButton: Locator;

    /**
     * Confirmation modal
     */
    public readonly confirmModal: Locator;
    public readonly confirmModalApplyChangesButton: Locator;
    public readonly confirmModalLoadingSpinner: Locator;
    public readonly confirmModalSuccessHeader: Locator;
    public readonly confirmModalSuccessCloseButton: Locator;

    constructor(public readonly page: Page) {

        // Manufacturer
        this.changeManufacturerRow = page.locator('.sw-bulk-edit-change-field-manufacturerId');
        this.changeManufacturerCheckbox = this.changeManufacturerRow.getByRole('checkbox');
        this.manufacturerDropdown = this.changeManufacturerRow.locator('.sw-select__selection');
        this.manufacturerDropdownInput = this.changeManufacturerRow.getByPlaceholder('Select manufacturer...');
        this.manufacturerListResult = this.changeManufacturerRow.getByRole('list');

        // Active
        this.changeActiveRow = page.locator('.sw-bulk-edit-change-field-active');
        this.changeActiveCheckbox = this.changeActiveRow.getByRole('checkbox').first();
        this.activeToggle = this.changeActiveRow.getByRole('checkbox').last();

        // Price
        this.changePriceRow = page.locator('.sw-bulk-edit-change-field-price');
        this.changePriceCheckbox = this.changePriceRow.getByRole('checkbox');
        this.grossPriceInput = this.changePriceRow.getByPlaceholder('Enter gross price...');

        // Release date
        this.changeReleaseDateRow = page.locator('.sw-bulk-edit-change-field-releaseDate');
        this.changeReleaseDateCheckbox = this.changeReleaseDateRow.getByRole('checkbox');
        this.releaseDateInput = this.changeReleaseDateRow.getByPlaceholder('Y-m-d H:i').last();

        // Stock
        this.changeStockRow = page.locator('.sw-bulk-edit-change-field-stock');
        this.changeStockCheckbox = this.changeStockRow.getByRole('checkbox');
        this.stockChangeMethodDropdown = this.changeStockRow.locator('.sw-single-select__selection-text');
        this.stockChangeMethodInput = this.changeStockRow.locator('.sw-single-select__selection-input');
        this.stockInput = this.changeStockRow.getByPlaceholder('Enter quantity in stock...');

        // Restock time
        this.changeRestockTimeRow = page.locator('.sw-bulk-edit-change-field-restockTime');
        this.changeRestockTimeCheckbox = this.changeRestockTimeRow.getByRole('checkbox');
        this.restockTimeChangeMethodDropdown = this.changeRestockTimeRow.locator('.sw-single-select__selection-text');
        this.restockTimeChangeMethodInput = this.changeRestockTimeRow.locator('.sw-single-select__selection-input');
        this.restockTimeInput = this.changeRestockTimeRow.getByPlaceholder('Enter restock time in days...');

        // Tags
        this.changeTagsRow = page.locator('.sw-bulk-edit-change-field-tags');
        this.changeTagsCheckbox = this.changeTagsRow.getByRole('checkbox');
        this.tagsChangeMethodDropdown = this.changeTagsRow.locator('.sw-single-select__selection-text');
        this.tagsChangeMethodInput = this.changeTagsRow.locator('.sw-single-select__selection-input');
        this.tagsInput = this.changeTagsRow.getByPlaceholder('Enter tags...');

        // Sales Channel
        this.changeSalesChannelRow = page.locator('.sw-bulk-edit-change-field-visibilities');
        this.changeSalesChannelCheckbox = this.changeSalesChannelRow.getByRole('checkbox');
        this.salesChannelChangeMethodDropdown = this.changeSalesChannelRow.locator('.sw-single-select__selection-text');
        this.salesChannelChangeMethodInput = this.changeSalesChannelRow.locator('.sw-single-select__selection-input');
        this.salesChannelInput = this.changeSalesChannelRow.getByRole('textbox');

        this.applyChangesButton = page.getByRole('button', {name: 'Apply changes'});

        this.confirmModal = page.locator('.sw-bulk-edit-save-modal');
        this.confirmModalApplyChangesButton = this.confirmModal.getByRole('button', {name: 'Apply changes'});
        this.confirmModalLoadingSpinner = this.confirmModal.locator('.sw-bulk-edit-save-modal__loading-icon');
        this.confirmModalSuccessHeader = this.confirmModal.getByRole('heading', {name: 'Bulk edit - Success'});
        
        // There are two close buttons, the button itself and the X, we use the X here
        this.confirmModalSuccessCloseButton = this.confirmModal.getByRole('button', {name: 'Close'}).first();
    }

    url() {
        // Bulk edit page does not have a URL, but the class needs a URL method.
        throw new Error('Bulk edit page does not have a callable URL.');
        return '';
    }

    async getDropdownEntry(entry: string): Promise<Locator> {
        return this.page.locator(`.sw-select-result`, { hasText: entry } );
    } 
}