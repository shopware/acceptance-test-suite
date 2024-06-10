import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Search implements PageObject {

    public readonly headline: Locator;
    public readonly productImages: Locator;

    constructor(public readonly page: Page) {
        this.headline = page.locator('h1.search-headline');
        this.productImages = page.locator('.product-image-link');
    }

    url(searchTerm: string) {
        return `search?search=${searchTerm}`;
    }
}
