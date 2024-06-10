import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountAddresses implements PageObject {
    public readonly addNewAddressButton: Locator;
    public readonly editBillingAddressButton: Locator;
    public readonly editShippingAddressButton: Locator;
    public readonly useDefaultBillingAddressButton: Locator;
    public readonly useDefaultShippingAddressButton: Locator;

    constructor(public readonly page: Page) {
        this.addNewAddressButton = page.getByRole('link', { name: 'Add new address' });
        this.editBillingAddressButton = page.getByRole('link', { name: 'Edit address' }).first();
        this.editShippingAddressButton = page.getByRole('link', { name: 'Edit address' }).nth(1);
        this.useDefaultBillingAddressButton = page.getByRole('button', { name: 'Use as default billing address' });
        this.useDefaultShippingAddressButton = page.getByRole('button', { name: 'Use as default shipping address' });
    }

    url() {
        return 'account/address';
    }
}