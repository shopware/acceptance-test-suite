import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class CheckoutFinish implements PageObject {
    public readonly headline: Locator;
    public readonly orderNumberText: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly taxPrice: Locator;
    public readonly cartLineItemImages: Locator;
    public readonly page: Page;

    private readonly orderNumberRegex = /Your order number: #(\d+)/;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole('heading', { name: translate('storefront:checkout:finish.thankYouForOrder') });
        this.orderNumberText = page.getByText(this.orderNumberRegex);
        this.grandTotalPrice = page.locator(`dt:has-text("${translate('storefront:checkout:finish.grandTotal')}") + dd`);
        this.taxPrice = page.locator(`dt:text-matches('${translate('storefront:checkout:finish.plusVat')} [0-9]\\+\\?${translate('storefront:checkout:finish.vatSuffix')}') + dd`);
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
