import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class Search implements PageObject {

    public readonly headline: Locator;
    public readonly productImages: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.locator('h1.search-headline');
        this.productImages = page.locator('.product-image-wrapper');
    }

    url(searchTerm: string) {
        return `search?search=${searchTerm}`;
    }
}
