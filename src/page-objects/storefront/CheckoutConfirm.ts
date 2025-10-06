import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CheckoutConfirm implements PageObject {
    public readonly headline: Locator;
    public readonly termsAndConditionsCheckbox: Locator;
    public readonly immediateAccessToDigitalProductCheckbox: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly taxPrice: Locator;
    public readonly submitOrderButton: Locator;

    /**
     * Payment and Shipping options
     */
    public readonly paymentMethodRadioGroup: Locator;
    public readonly shippingMethodRadioGroup: Locator;

    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentCashOnDelivery: Locator;
    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentPaidInAdvance: Locator;
    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentInvoice: Locator;

    /**  @deprecated - Use 'shippingMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly shippingStandard: Locator;
    /**  @deprecated - Use 'shippingMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly shippingExpress: Locator;

    /**
     * Product details
     */
    public readonly cartLineItemImages: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole('heading', { name: 'Complete order' });
        this.termsAndConditionsCheckbox = page.getByLabel('I have read and accepted the general terms and conditions.');
        this.immediateAccessToDigitalProductCheckbox = page.getByLabel('I want immediate access to the digital content and I acknowledge that thereby I waive my right to cancel.');
        this.grandTotalPrice = page.locator(`dt:has-text('Grand total') + dd`);
        this.taxPrice = page.locator(`dt:text-matches('plus [0-9]\\+\\?% VAT') + dd`);
        this.submitOrderButton = page.getByRole('button', { name: 'Submit order' });

        this.paymentMethodRadioGroup = page.locator('.checkout-card', { hasText: 'Payment method' });
        this.shippingMethodRadioGroup = page.locator('.checkout-card', { hasText: 'Shipping method' });

        this.paymentCashOnDelivery = page.getByLabel('Cash on delivery');
        this.paymentPaidInAdvance = page.getByLabel('Paid in advance');
        this.paymentInvoice = page.getByLabel('Invoice');

        this.shippingStandard = page.getByLabel('Standard');
        this.shippingExpress = page.getByLabel('Express');

        this.cartLineItemImages = page.locator('.line-item-img-link');
    }

    url() {
        return 'checkout/confirm';
    }
}
