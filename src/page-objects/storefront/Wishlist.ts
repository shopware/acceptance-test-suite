import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { Home } from './Home';

export class Wishlist extends Home implements PageObject {
    public readonly wishListHeader: Locator;
    public readonly removeAlert: Locator;
    public readonly emptyListing: Locator;

    public readonly offCanvas: Locator;
    public readonly offCanvasCartTitle: Locator;
    public readonly offCanvasCart: Locator;
    public readonly offCanvasCartGoToCheckoutButton: Locator;
    public readonly offCanvasLineItemImages: Locator;
    public readonly offCanvasSummaryTotalPrice: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.wishListHeader = page.locator('.wishlist-headline');
        this.removeAlert = page.locator('.alert-content');
        this.emptyListing = page.locator('.wishlist-listing-empty');

        this.offCanvas = page.locator('offcanvas-body');
        this.offCanvasCartTitle = page.getByText('Shopping cart', { exact: true });
        this.offCanvasCart = page.getByRole('dialog');
        this.offCanvasCartGoToCheckoutButton = page.getByRole('link', { name: 'Go to checkout' });
        this.offCanvasLineItemImages = page.locator('.line-item-img-link');
        this.offCanvasSummaryTotalPrice = page.locator('.offcanvas-summary').locator('dt:has-text("Subtotal") + dd');
    }

    url() {
        return `wishlist`;
    }
}