import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class OrderListing implements PageObject {
    public readonly addOrderButton: Locator;
    public readonly orderRows: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.addOrderButton = page.getByText(translate('administration:order:listing.addOrder'));
        this.orderRows = page.getByRole('row');
    }

    async getLineItemByOrderNumber(orderNumber: string) {
        let orderDeliveryStateText;
        let orderPaymentStateText;
        let orderDeliveryAddressText;

        const lineItem = this.page.getByRole('row').filter({ hasText: orderNumber });
        const orderNumberText = lineItem.getByText(orderNumber);
        const orderCustomerNameText = lineItem.locator('.sw-data-grid__cell--orderCustomer-firstName');

        if (satisfies(this.instanceMeta.version, '<=6.7.0.0')) {
            orderDeliveryAddressText = lineItem.locator('.sw-order-list__delivery_address');
            orderPaymentStateText = lineItem.locator('.sw-data-grid__cell--transactions-last\\(\\)-stateMachineState-name');
            orderDeliveryStateText = lineItem.locator('.sw-data-grid__cell--deliveries\\[0\\]-stateMachineState-name');
        } else {
            orderDeliveryStateText = lineItem.locator('.sw-data-grid__cell--primaryOrderDelivery-stateMachineState-name');
            orderPaymentStateText = lineItem.locator('.sw-data-grid__cell--primaryOrderTransaction-stateMachineState-name');
            orderDeliveryAddressText = lineItem.locator('.sw-data-grid__cell--primaryOrderDelivery-shippingOrderAddress-street');
        }
        const orderTotalAmountText = lineItem.locator('.sw-data-grid__cell--amountTotal');
        const orderStateText = lineItem.locator('.sw-data-grid__cell--stateMachineState-name');
        const orderDateText = lineItem.locator('.sw-data-grid__cell--orderDateTime');
        const orderCheckbox = lineItem.locator('.sw-data-grid__cell--selection');
        const orderContextButton = lineItem.locator('.sw-context-button__button');
        const orderViewButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: translate('administration:order:actions.view') });
        const orderDeleteButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: translate('administration:order:actions.delete') });
        const warningDialog = this.page.getByRole('dialog', { name: translate('administration:order:dialogs.warning') });
        const warningDialogCancelButton = warningDialog.getByRole('button', { name: translate('administration:order:actions.cancel') });
        const warningDialogDeleteButton = warningDialog.getByRole('button', { name: translate('administration:order:actions.delete') });

        return {
            orderNumberText: orderNumberText,
            orderCustomerNameText: orderCustomerNameText,
            orderDeliveryAddressText: orderDeliveryAddressText,
            orderTotalAmountText: orderTotalAmountText,
            orderStateText: orderStateText,
            orderPaymentStateText: orderPaymentStateText,
            orderDeliveryStateText: orderDeliveryStateText,
            orderDateText: orderDateText,
            orderCheckbox: orderCheckbox,
            orderContextButton: orderContextButton,
            orderViewButton: orderViewButton,
            orderDeleteButton: orderDeleteButton,
            warningDialog: warningDialog,
            warningDialogCancelButton: warningDialogCancelButton,
            warningDialogDeleteButton: warningDialogDeleteButton,
        };
    }

    url() {
        return `#/sw/order/index`;
    }
}
