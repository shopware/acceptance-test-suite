import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class CheckoutConfirm implements PageObject {
    public readonly headline: Locator;
    public readonly termsAndConditionsCheckbox: Locator;
    public readonly immediateAccessToDigitalProductCheckbox: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly taxPrice: Locator;
    public readonly submitOrderButton: Locator;

    /**
     * Payment options
     */
    public readonly paymentCashOnDelivery: Locator;
    public readonly paymentPaidInAdvance: Locator;
    public readonly paymentInvoice: Locator;

    /**
     * Shipping options
     */
    public readonly shippingStandard: Locator;
    public readonly shippingExpress: Locator;

    /**
     * Product details
     */
    public readonly cartLineItemImages: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole('heading', { name: translate('storefront:checkout:confirm.completeOrder') });
        this.termsAndConditionsCheckbox = page.getByLabel(translate('storefront:checkout:confirm.termsAndConditions'));
        this.immediateAccessToDigitalProductCheckbox = page.getByLabel(translate('storefront:checkout:confirm.immediateAccessToDigitalProduct'));
        this.grandTotalPrice = page.locator(`dt:has-text('${translate('storefront:checkout:common.grandTotal')}') + dd`);
        this.taxPrice = page.locator(`dt:text-matches("${translate('storefront:checkout:common.plusVat')} [0-9]\\+\\?${translate('storefront:checkout:common.vatSuffix')}") + dd`);
        this.submitOrderButton = page.getByRole('button', { name: translate('storefront:checkout:confirm.submitOrder') });

        this.paymentCashOnDelivery = page.getByLabel(translate('storefront:checkout:common.cashOnDelivery'));
        this.paymentPaidInAdvance = page.getByLabel(translate('storefront:checkout:common.paidInAdvance'));
        this.paymentInvoice = page.getByLabel(translate('storefront:checkout:common.invoice'));

        this.shippingStandard = page.getByLabel(translate('storefront:checkout:common.standard'));
        this.shippingExpress = page.getByLabel(translate('storefront:checkout:common.express'));

        this.cartLineItemImages = page.locator('.line-item-img-link');
    }

    url() {
        return 'checkout/confirm';
    }
}
