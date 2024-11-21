import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Home implements PageObject {

    public readonly productImages: Locator;
    public readonly productListItems: Locator;
    public readonly languagesDropdown: Locator;
    public readonly currenciesDropdown: Locator;

    constructor(public readonly page: Page) {
        this.productImages = page.locator('.product-image-link');
        this.productListItems = page.getByRole('listitem');
        this.languagesDropdown = page.getByLabel('Shop settings').locator('.languages-menu');
        this.currenciesDropdown = page.getByLabel('Shop settings').locator('.currencies-menu');
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

    url() {
        return './';
    }
}
