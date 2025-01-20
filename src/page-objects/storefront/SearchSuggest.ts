import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class SearchSuggest implements PageObject {

    public readonly searchSuggestLineItemImages: Locator;
    public readonly searchInput: Locator;
    public readonly searchIcon: Locator;
    public readonly searchSuggestNoResult: Locator;
    public readonly searchSuggestLineItemName: Locator;
    public readonly searchSuggestLineItemPrice: Locator;
    public readonly searchSuggestTotalLink: Locator;
    public readonly searchHeadline: Locator;

    constructor(public readonly page: Page) {
        this.searchSuggestLineItemImages = page.locator('.search-suggest-product-image-container');
        this.searchInput = page.locator('.header-search-input');
        this.searchIcon = page.locator('.header-search-icon');
        this.searchSuggestNoResult = page.locator ('.search-suggest-no-result');
        this.searchSuggestLineItemName = page.locator ('.search-suggest-product-name');
        this.searchSuggestLineItemPrice = page.locator ('.col-auto.search-suggest-product-price');
        this.searchSuggestTotalLink = page.locator ('.search-suggest-total-link');
        this.searchHeadline = page.locator ('.search-headline');
    }

    async getListingItemByProductId(productId: string): Promise<Record<string, Locator>> {
        const listingItem = this.page.getByRole('listitem').filter({ has: this.page.locator(`[value="${productId}"]`) });
        const productImage = listingItem.locator('.product-image-link');
        const productRating = listingItem.locator('.product-rating');
        const productVariantCharacteristics = listingItem.locator('.product-variant-characteristics');
        const productDescription = listingItem.locator('.product-description');
        const productPriceUnit = listingItem.locator('.product-price-unit');
        const productCheapestPrice = listingItem.locator('.product-cheapest-price');
        const productPrice = listingItem.locator('.product-price');
        const productName = listingItem.locator('.product-name');
        const productAddToShoppingCart = listingItem.getByRole('button', { name: 'Add to shopping cart' });

        return {
            productImage: productImage,
            productRating: productRating,
            productVariantCharacteristics: productVariantCharacteristics,
            productDescription: productDescription,
            productPriceUnit: productPriceUnit,
            productCheapestPrice: productCheapestPrice,
            productPrice: productPrice,
            productName: productName,
            productAddToShoppingCart: productAddToShoppingCart,
        }
    }

    url(searchTerm: string) {
        return `suggest?search=${searchTerm}`;
    }
}
