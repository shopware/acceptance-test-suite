import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class Category implements PageObject {
    public readonly sortingSelect: Locator;
    public readonly firstProductBuyButton: Locator;
    public readonly noProductsFoundAlert: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.sortingSelect = page.getByLabel('Sorting');
        this.firstProductBuyButton = page.getByRole('button', { name: 'Add to shopping cart' }).first();
        this.noProductsFoundAlert = page.getByText('No products found.');
    }

    url(categoryName: string): string {
        return `${categoryName}/`;
    }
}