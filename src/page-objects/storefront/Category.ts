import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import type { components } from '@shopware/api-client/admin-api-types';

export class Category implements PageObject {
    public readonly categoryData: components['schemas']['Category'];

    public readonly sortingSelect: Locator;
    public readonly firstProductBuyButton: Locator;
    public readonly noProductsFoundAlert: Locator;

    constructor(public readonly page: Page, CategoryData: components['schemas']['Category']) {
        this.categoryData = CategoryData;

        this.sortingSelect = page.getByLabel('Sorting');
        this.firstProductBuyButton = page.getByRole('button', { name: 'Add to shopping cart' }).first();
        this.noProductsFoundAlert = page.getByText('No products found.');
    }

    async goTo() {
        const url= `${this.categoryData.name}`;
        await this.page.goto(url);
    }
}