import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountPayment implements PageObject {
    public readonly cashOnDeliveryOption: Locator;
    public readonly paidInAdvanceOption: Locator;
    public readonly invoiceOption: Locator;
    public readonly changeDefaultPaymentButton: Locator;

    constructor(public readonly page: Page) {
        this.cashOnDeliveryOption = page.getByLabel('Cash on delivery');
        this.paidInAdvanceOption = page.getByLabel('Paid in advance');
        this.invoiceOption = page.getByLabel('Invoice');
        this.changeDefaultPaymentButton = page.getByRole('button', { name: 'Change' });
    }

    url() {
        return 'account/payment';
    }
}