import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Category implements PageObject {
    public readonly sortingSelect: Locator;
    public readonly firstProductBuyButton: Locator;
    public readonly noProductsFoundAlert: Locator;

    constructor(public readonly page: Page) {
        this.sortingSelect = page.getByLabel('Sorting');
        this.firstProductBuyButton = page.getByRole('button', { name: 'Add to shopping cart' }).first();
        this.noProductsFoundAlert = page.getByText('No products found.');
    }

    url(categoryName: string): string {
        return `${categoryName}/`;
    }
}