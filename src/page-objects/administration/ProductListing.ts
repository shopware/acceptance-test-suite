import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ProductListing implements PageObject {

    /**
     * Multi selection
     */
    public readonly productsTable: Locator;
    public readonly bulkEditButton: Locator;

    /**
     * Bulk edit modal
     */
    public readonly bulkEditModal: Locator;
    public readonly startbulkEditButton: Locator;


    constructor(public readonly page: Page) {

        this.productsTable = page.locator('.sw-data-grid__table');
        this.bulkEditButton = page.getByRole('button', {name: 'Bulk edit'});

        this.bulkEditModal = page.locator('.sw-product-bulk-edit-modal');
        this.startbulkEditButton = this.bulkEditModal.getByRole('button', {name: 'Start bulk edit'});
    }

    url() {
        return `#/sw/product/index`
    }

    /**
     * Returns the table row containing the product with the given product number.
     *
     * @param productNumber - Id of the product you are looking for.
     */
    async getProductRow(productNumber: string): Promise<Record<string, Locator>> {
        const productTableRow = this.productsTable.locator('.sw-data-grid__row', { hasText: productNumber });
        const selectionCheckboxSelector = '.sw-field--checkbox';
        const productNameSelector = '.sw-data-grid__cell--name';
        const productNumberSelector = '.sw-data-grid__cell--productNumber';
        const productPriceSelector = '.sw-data-grid__cell--price-EUR';
        
        return {
            selectionCheckbox: productTableRow.locator(selectionCheckboxSelector),
            productName: productTableRow.locator(productNameSelector),
            productNumber: productTableRow.locator(productNumberSelector),
            productPrice: productTableRow.locator(productPriceSelector),
        };
    }
}
