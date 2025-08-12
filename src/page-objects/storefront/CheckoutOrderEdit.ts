import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CheckoutOrderEdit implements PageObject{
    public readonly completePaymentButton: Locator;
    public readonly orderCancelButton: Locator;
    public readonly dialogOrderCancel: Locator;
    public readonly dialogOrderCancelButton: Locator;
    public readonly dialogBackButton: Locator;

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

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;

        this.completePaymentButton = page.getByRole('button', { name : 'Complete payment' });
        this.orderCancelButton = page.getByRole('button', { name: 'Cancel order' });
        this.dialogOrderCancel = page.getByRole('dialog', { name: 'Cancel order' });
        this.dialogOrderCancelButton = this.dialogOrderCancel.getByRole('button', { name: 'Cancel order' });
        this.dialogBackButton = this.dialogOrderCancel.getByRole('button', { name: 'Back' });

        this.paymentCashOnDelivery = page.getByLabel('Cash on delivery');
        this.paymentPaidInAdvance = page.getByLabel('Paid in advance');
        this.paymentInvoice = page.getByLabel('Invoice');

        this.shippingStandard = page.getByLabel('Standard');
        this.shippingExpress = page.getByLabel('Express');
    }

    url(orderUuid: string) {
        return `account/order/edit/${orderUuid}`;
    }

    /**
     * Returns the radio button element for a specified payment method.
     *
     * @param paymentMethodName - Name of the payment method on the page.
     */
    getPaymentMethodButton(paymentMethodName: string): Locator {
        return this.page.getByLabel(paymentMethodName);
    }
}
