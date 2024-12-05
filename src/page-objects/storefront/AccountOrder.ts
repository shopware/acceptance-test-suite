import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountOrder implements PageObject {

    public readonly cartLineItemImages: Locator;
    public readonly orderExpandButton: Locator;
    public readonly digitalProductDownloadButton: Locator;
    public readonly dialogOrderCancel: Locator;
    public readonly dialogOrderCancelButton: Locator;
    public readonly dialogBackButton: Locator;

    constructor(public readonly page: Page) {
        this.orderExpandButton = page.getByRole('button', {name: /Expand|Show details/}).first();
        this.cartLineItemImages = page.locator('.line-item-img-link');
        this.digitalProductDownloadButton = page.getByRole('link', { name: 'Download' }).first();
        this.dialogOrderCancel = page.getByRole('dialog', { name: 'Cancel order' });
        this.dialogOrderCancelButton = this.dialogOrderCancel.getByRole('button', { name: 'Cancel order' });
        this.dialogBackButton = this.dialogOrderCancel.getByRole('button', { name: 'Back' });

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

        }
    }
    getViewSubscriptionLink = (orderNumber: string): Locator => {
        const orderContainer = this.page.locator('.order-item-header', { hasText: `Order Number: ${orderNumber}`});
        return orderContainer.getByText('View Subscription');
    };

    url() {
        return 'account/order';
    }
}
