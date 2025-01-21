import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';

export class SearchSuggest extends Home implements PageObject {

    public readonly searchSuggestLineItemImages: Locator;
    public readonly searchInput: Locator;
    public readonly searchIcon: Locator;
    public readonly searchSuggestNoResult: Locator;
    public readonly searchSuggestLineItemName: Locator;
    public readonly searchSuggestLineItemPrice: Locator;
    public readonly searchSuggestTotalLink: Locator;
    public readonly searchHeadline: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.searchSuggestLineItemImages = page.locator('.search-suggest-product-image-container');
        this.searchInput = page.locator('.header-search-input');
        this.searchIcon = page.locator('.header-search-icon');
        this.searchSuggestNoResult = page.locator ('.search-suggest-no-result');
        this.searchSuggestLineItemName = page.locator ('.search-suggest-product-name');
        this.searchSuggestLineItemPrice = page.locator ('.col-auto.search-suggest-product-price');
        this.searchSuggestTotalLink = page.locator ('.search-suggest-total-link');
        this.searchHeadline = page.locator ('.search-headline');
    }

    url(searchTerm?: string) {
        return `suggest?search=${searchTerm}`;
    }
}
