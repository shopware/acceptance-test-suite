import type { Page, Locator } from 'playwright-core';
import { BaseAccount } from './BaseAccount';
import { translate } from '../../services/LanguageHelper';

export class AccountOrder extends BaseAccount {

    public readonly cartLineItemImages: Locator;
    public readonly orderExpandButton: Locator;
    public readonly digitalProductDownloadButton: Locator;
    public readonly dialogOrderCancel: Locator;
    public readonly dialogOrderCancelButton: Locator;
    public readonly dialogBackButton: Locator;
    public readonly orderDetails: Locator;
    public readonly invoiceHTML: Locator;
    public readonly creditItem: Locator;
    public readonly noOrdersAlert: Locator;

    constructor(page: Page) {
        super(page);
        this.orderExpandButton = page
            .getByRole('button', { name: new RegExp(`${translate('storefront:account:orders.expand')}|${translate('storefront:account:orders.showDetails')}`) })
            .first();
        this.cartLineItemImages = page.locator('.line-item-img-link');
        this.digitalProductDownloadButton = page.getByRole('link', { name: translate('storefront:account:orders.download') }).first();
        this.dialogOrderCancel = page.getByRole('dialog', { name: translate('storefront:account:orders.cancelOrder') });
        this.dialogOrderCancelButton = this.dialogOrderCancel.getByRole('button', { name: translate('storefront:account:orders.cancelOrder') });
        this.dialogBackButton = this.dialogOrderCancel.getByRole('button', { name: translate('storefront:account:common.back') });
        this.orderDetails = page.locator('.order-item-detail');
        this.invoiceHTML = page.getByRole('link', { name: '.html' });
        this.creditItem = page.locator(`.line-item:has-text("${translate('storefront:account:orders.creditItem')}")`);
        this.noOrdersAlert = page.locator('.alert-warning');
    }

    async getOrderByOrderNumber(orderNumber: string): Promise<Record<string, Locator>> {
        const orderItem = this.page.getByRole('listitem').getByLabel(`${translate('storefront:account:orders.orderNumber')} ${orderNumber}`);
        const orderStatus = orderItem.locator('.order-table-header-order-status');
        const orderHeading = orderItem.locator('.order-table-header-heading');
        const orderActionsButton = orderItem.getByLabel(translate('storefront:account:orders.actions'));
        const orderCancelButton = orderItem.getByRole('button', { name: translate('storefront:account:orders.cancelOrder') });
        const orderRepeatButton = orderItem.getByRole('button', { name: translate('storefront:account:orders.repeatOrder') });
        const orderChangePaymentMethodButton = orderItem.getByRole('link', { name: translate('storefront:account:orders.changePaymentMethod') });
        const orderShippingStatus = orderItem.locator('.order-table-body-value').nth(1);
        const orderPaymentStatus = orderItem.locator('.order-table-body-value').nth(2);
        const orderPaymentMethod = orderItem.locator('.order-table-body-value').nth(3);
        const orderShippingMethod = orderItem.locator('.order-table-body-value').nth(4);
        const orderDetailButton = orderItem.getByRole('button', {
            name: new RegExp(`${translate('storefront:account:orders.expand')}|${translate('storefront:account:orders.showDetails')}`),
        });
        const orderImage = orderItem.locator('.line-item-img-link');
        const taxPrice = orderItem.locator(
            `dt:text-matches('${translate('storefront:account:orders.plusVat')} [0-9]\\+\\?${translate('storefront:account:orders.vatSuffix')}') + dd`,
        );
        const shippingCosts = orderItem.locator(`dt:text-matches('${translate('storefront:account:orders.shippingCosts')}') + dd`);
        const totalGross = orderItem.locator(`dt:text-matches('${translate('storefront:account:orders.totalGross')}') + dd`);

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
        };
    }

    url() {
        return 'account/order';
    }
}
