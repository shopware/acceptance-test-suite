import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ProductListing implements PageObject {

    /**
     * Multi selection
     */
    public readonly productsTable: Locator;
    public readonly bulkEdit: Locator;



    constructor(public readonly page: Page) {

        this.productsTable = page.locator('.sw-data-grid__table');

    }

    url(productId: string) {
        return `#/sw/product/detail/${productId}/base`
    }
}
