import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class SearchSuggest implements PageObject {

    public readonly searchSuggestLineItemImages: Locator;

    constructor(public readonly page: Page) {
        this.searchSuggestLineItemImages = page.locator('.search-suggest-product-image-container');
    }

    async goTo() {
        const url = `suggest?search`;
        await this.page.goto(url);
    }
}
