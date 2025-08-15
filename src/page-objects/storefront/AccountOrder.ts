import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class AccountOrder implements PageObject {

    public readonly cartLineItemImages: Locator;
    public readonly orderExpandButton: Locator;
    public readonly digitalProductDownloadButton: Locator;
    public readonly dialogOrderCancel: Locator;
    public readonly dialogOrderCancelButton: Locator;
    public readonly dialogBackButton: Locator;
    public readonly orderDetails: Locator;
    public readonly invoiceHTML: Locator;
    public readonly creditItem: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.orderExpandButton = page.getByRole('button', {name: /Expand|Show details/}).first();
        this.cartLineItemImages = page.locator('.line-item-img-link');
        this.digitalProductDownloadButton = page.getByRole('link', { name: 'Download' }).first();
        this.dialogOrderCancel = page.getByRole('dialog', { name: 'Cancel order' });
        this.dialogOrderCancelButton = this.dialogOrderCancel.getByRole('button', { name: 'Cancel order' });
        this.dialogBackButton = this.dialogOrderCancel.getByRole('button', { name: 'Back' });
        this.orderDetails = page.locator('.order-item-detail');
        this.invoiceHTML = page.getByRole('link', { name: '.html' });
        this.creditItem = page.locator('.line-item:has-text("CreditItem")');
    }

    async getOrderByOrderNumber(orderNumber: string): Promise<Record<string, Locator>> {

        const orderItem = this.page.getByRole('listitem').getByLabel(`Order number ${orderNumber}`);
        const orderStatus = orderItem.locator('.order-table-header-order-status');
        const orderHeading = orderItem.locator('.order-table-header-heading');
        const orderActionsButton = orderItem.getByLabel('Actions');
        const orderCancelButton = orderItem.getByRole('button', { name: 'Cancel order' });
        const orderRepeatButton = orderItem.getByRole('button', { name: 'Repeat order' });
        const orderChangePaymentMethodButton = orderItem.getByRole('link', { name: 'Change payment method' });
        const orderShippingStatus = orderItem.locator('.order-table-body-value').nth(1);
        const orderPaymentStatus = orderItem.locator('.order-table-body-value').nth(2);
        const orderPaymentMethod = orderItem.locator('.order-table-body-value').nth(3);
        const orderShippingMethod = orderItem.locator('.order-table-body-value').nth(4);
        const orderDetailButton = orderItem.getByRole('button', {name: /Expand|Show details/});
        const orderImage = orderItem.locator('.line-item-img-link');
        const taxPrice = orderItem.locator(`dt:text-matches('plus [0-9]\\+\\?% VAT') + dd`);
        const shippingCosts = orderItem.locator(`dt:text-matches('Shipping costs:') + dd`);
        const totalGross = orderItem.locator(`dt:text-matches('Total (gross):') + dd`);

        return {
            orderStatus: orderStatus,
            orderHeading: orderHeading,
            orderActionsButton: orderActionsButton,
            orderCancelButton: orderCancelButton,
            orderRepeatButton: orderRepeatButton,
            orderChangePaymentMethodButton: orderChangePaymentMethodButton,
            orderShippingStatus: orderShippingStatus,
            orderPaymentStatus: orderPaymentStatus,
            orderPaymentMethod: orderPaymentMethod,
            orderShippingMethod: orderShippingMethod,
            orderDetailButton: orderDetailButton,
            orderImage: orderImage,
            taxPrice: taxPrice,
            shippingCosts: shippingCosts,
            totalGross: totalGross,
        }
    }

    url() {
        return 'account/order';
    }
}
