import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CheckoutRegister implements PageObject {

    public readonly cartLineItemImages: Locator;

    constructor(public readonly page: Page) {
        this.cartLineItemImages = page.locator('.line-item-img-link');
    }

    url() {
        return 'checkout/register';
    }
}
