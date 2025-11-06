import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';
import { translate } from '../../services/LanguageHelper';

export class Wishlist extends Home implements PageObject {
    public readonly wishListHeader: Locator;
    public readonly removeAlert: Locator;
    public readonly emptyListing: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.wishListHeader = page.locator('.wishlist-headline');
        this.removeAlert = page.locator('.alert-success');
        this.emptyListing = page.locator('.wishlist-listing-empty');
    }

    async getListingItemByProductName(productListingName: string): Promise<Record<string, Locator>> {
        const baseItems = await super.getListingItemByProductName(productListingName);
        const listingItem = this.page.getByRole('listitem').filter({ has: this.page.getByText(productListingName) });
        const removeFromWishlistButton = listingItem.getByTitle(translate('storefront:wishlist:removeProduct'));
    
        return {
            ...baseItems,
            removeFromWishlistButton: removeFromWishlistButton,
        };
    }

    url() {
        return `wishlist`;
    }
}