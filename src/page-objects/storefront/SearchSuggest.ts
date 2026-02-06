import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { Home } from "./Home";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";

export class SearchSuggest extends Home implements PageObject {
    public readonly searchSuggestLineItemImages: Locator;
    public readonly searchInput: Locator;
    public readonly searchIcon: Locator;
    public readonly searchSuggestNoResult: Locator;
    public readonly searchSuggestLineItemName: Locator;
    public readonly searchSuggestLineItemPrice: Locator;
    public readonly searchSuggestTotalLink: Locator;
    public readonly searchResultTotal: Locator;
    public readonly searchHeadline: Locator;

    public readonly page: Page;

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        super(page, instanceMeta);
        this.page = page;
        this.searchSuggestLineItemImages = page.locator(".search-suggest-product-image-container");
        this.searchInput = page.locator(".header-search-input");
        this.searchIcon = page.locator(".header-search-icon");
        this.searchSuggestNoResult = page.locator(".search-suggest-no-result");
        this.searchSuggestLineItemName = page.locator(".search-suggest-product-name");
        this.searchSuggestLineItemPrice = page.locator(".col-auto.search-suggest-product-price");
        this.searchSuggestTotalLink = page.locator(".search-suggest-total-link");
        this.searchResultTotal = page.locator(".search-suggest-total-count");
        this.searchHeadline = page.locator(".search-headline");
    }

    async getTotalSearchResultCount(): Promise<number> {
        const totalCountText = await this.searchResultTotal.textContent();
        return parseInt(totalCountText?.trim().replace(/\D/g, "") || "0", 10);
    }

    url(searchTerm?: string) {
        return `suggest?search=${searchTerm}`;
    }
}
