import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';

export class Wishlist extends Home implements PageObject {
    public readonly wishListHeader: Locator;
    public readonly removeAlert: Locator;
    public readonly emptyListing: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.wishListHeader = page.locator('.wishlist-headline');
        this.removeAlert = page.locator('.alert-content');
        this.emptyListing = page.locator('.wishlist-listing-empty');
    }

    async getListingItemByProductId(productId: string): Promise<Record<string, Locator>> {
        const baseItems = await super.getListingItemByProductId(productId);
        const listingItem = this.page.getByRole('listitem').filter({ has: this.page.locator(`[value="${productId}"]`) });
        const removeFromWishlistButton = listingItem.locator('.icon-wishlist-remove');
    
        return {
            ...baseItems,
            removeFromWishlistButton: removeFromWishlistButton,
        };
    }

    url() {
        return `wishlist`;
    }
}