import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class ProductListing implements PageObject {

    /**
     * Multi selection
     */
    public readonly productsTable: Locator;
    public readonly bulkEditButton: Locator;
    public readonly page: Page;

    /**
     * Bulk edit modal
     */
    public readonly bulkEditModal: Locator;
    public readonly startBulkEditButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productsTable = page.locator('.sw-data-grid__table');
        this.bulkEditButton = page.getByRole('button', {name: 'Bulk edit'});

        this.bulkEditModal = page.locator('.sw-product-bulk-edit-modal');
        this.startBulkEditButton = this.bulkEditModal.getByRole('button', {name: 'Start bulk edit'});
    }

    /**
     * Returns the url to the listing page.
     *
     * @param searchTerms - Includes search terms for filtering of the product list.
     */
    url(searchTerms: string[] = []) {
        let url = '#/sw/product/index';
        if (searchTerms.length > 0) {
            let tempTerm = '';
            for (const searchTerm of searchTerms) {
                if (tempTerm != '') {
                    tempTerm += '+';
                } 
                tempTerm += searchTerm;
            } 
            url += `?limit=25&page=1&term=${tempTerm}`;
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
        const productNameSelector = '.sw-data-grid__cell--name';
        const productNumberSelector = '.sw-data-grid__cell--productNumber';
        const productManufacturerSelector = '.sw-data-grid__cell--manufacturer-name';
        const productActiveSelector = 'sw-icon__regular-checkmark-xs';
        const productInactiveSelector = 'sw-icon__regular-times-s';
        const productPriceSelector = '.sw-data-grid__cell--price-EUR';
        
        return {
            selectionCheckbox: productTableRow.getByRole('checkbox'),
            productName: productTableRow.locator(productNameSelector),
            productNumber: productTableRow.locator(productNumberSelector),
            productManufacturer: productTableRow.locator(productManufacturerSelector),
            productActive: productTableRow.getByTestId(productActiveSelector),
            productInactive: productTableRow.getByTestId(productInactiveSelector),
            productPrice: productTableRow.locator(productPriceSelector),
        };
    }
}
