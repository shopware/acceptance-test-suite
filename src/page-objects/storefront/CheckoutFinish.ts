import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CheckoutFinish implements PageObject {
    public readonly headline: Locator;
    public readonly orderNumberText: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly cartLineItemImages: Locator;

    private readonly orderNumberRegex = /Your order number: #(\d+)/;

    constructor(public readonly page: Page) {
        this.headline = page.getByRole('heading', { name: 'Thank you for your order' });
        this.orderNumberText = page.getByText(this.orderNumberRegex);
        this.grandTotalPrice = page.locator('dt:has-text("Grand total") + dd');
        this.cartLineItemImages = page.locator('.line-item-img-link');
    }

    url() {
        return 'checkout/finish';
    }

    async getOrderNumber(): Promise<string | null> {
        const orderNumberText = await this.orderNumberText.textContent();

        let orderNumber = null;
        if (orderNumberText !== null) {
            const matches = orderNumberText.match(this.orderNumberRegex);

            if (matches !== null && matches.length) {
                orderNumber = matches[1];
            }
        }

        return orderNumber;
    }

    getOrderId() {
        const url = this.page.url();
        const [, searchString] = url.split('?');
        const params = new URLSearchParams(searchString);

        return params.get('orderId');
    }
}
