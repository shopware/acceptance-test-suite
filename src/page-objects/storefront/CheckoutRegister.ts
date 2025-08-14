import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CheckoutRegister implements PageObject {

    public readonly cartLineItemImages: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.cartLineItemImages = page.locator('.line-item-img-link');
    }

    url() {
        return 'checkout/register';
    }
}
