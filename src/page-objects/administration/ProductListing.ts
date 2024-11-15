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
    public readonly startBulkEditButton: Locator;


    constructor(public readonly page: Page) {
        this.productsTable = page.locator('.sw-data-grid__table');
        this.bulkEditButton = page.getByRole('button', {name: 'Bulk edit'});

        this.bulkEditModal = page.locator('.sw-product-bulk-edit-modal');
        this.startBulkEditButton = this.bulkEditModal.getByRole('button', {name: 'Start bulk edit'});
    }

    url(searchTerm = '') {
        let url = '#/sw/product/index';
        if (searchTerm != ''){
            url += `?limit=25&page=1&term=${searchTerm}`;
        }
        return url;
    }

    /**
     * Returns the table row containing the product with the given product number.
     *
     * @param productNumber - Product number you are looking for.
     */
    async getProductRow(productNumber: string): Promise<Record<string, Locator>> {
        const productTableRow = this.productsTable.locator('.sw-data-grid__row', { hasText: productNumber });
        const selectionCheckboxSelector = '.sw-field--checkbox';
        const productNameSelector = '.sw-data-grid__cell--name';
        const productNumberSelector = '.sw-data-grid__cell--productNumber';
        const productPriceSelector = '.sw-data-grid__cell--price-EUR';
        
        return {
            selectionCheckbox: productTableRow.getByRole('checkbox'),
            productName: productTableRow.locator(productNameSelector),
            productNumber: productTableRow.locator(productNumberSelector),
            productPrice: productTableRow.locator(productPriceSelector),
        };
    }
}
