import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountOrder implements PageObject {

    public readonly cartLineItemImages: Locator;
    public readonly orderExpandButton: Locator;
    public readonly digitalProductDownloadButton: Locator;

    constructor(public readonly page: Page) {
        this.orderExpandButton = page.getByRole('button', {name: 'Expand'}).first();
        this.cartLineItemImages = page.locator('.line-item-img-link');
        this.digitalProductDownloadButton = page.getByRole('link', { name: 'Download' }).first();
    }

    url() {
        return 'account/order';
    }
}
