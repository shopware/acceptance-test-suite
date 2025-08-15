import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class AccountPayment implements PageObject {
    public readonly cashOnDeliveryOption: Locator;
    public readonly paidInAdvanceOption: Locator;
    public readonly invoiceOption: Locator;
    public readonly changeDefaultPaymentButton: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.cashOnDeliveryOption = page.getByLabel('Cash on delivery');
        this.paidInAdvanceOption = page.getByLabel('Paid in advance');
        this.invoiceOption = page.getByLabel('Invoice');
        this.changeDefaultPaymentButton = page.getByRole('button', { name: 'Change', exact: true });
    }

    url() {
        return 'account/payment';
    }
}