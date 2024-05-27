import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Account implements PageObject {
    public readonly headline: Locator;
    public readonly personalDataCardTitle: Locator;
    public readonly paymentMethodCardTitle: Locator;
    public readonly billingAddressCardTitle: Locator;
    public readonly shippingAddressCardTitle: Locator;
    public readonly newsletterCheckbox: Locator;
    public readonly newsletterRegistrationSuccessMessage: Locator;

    constructor(public readonly page: Page) {
        this.headline = page.getByRole('heading', { name: 'Overview' });
        this.personalDataCardTitle = page.getByRole('heading', { name: 'Personal data' });
        this.paymentMethodCardTitle = page.getByRole('heading', { name: 'Default payment method' });
        this.billingAddressCardTitle = page.getByRole('heading', { name: 'Default billing address' });
        this.shippingAddressCardTitle = page.getByRole('heading', { name: 'Default shipping address' });
        this.newsletterCheckbox = page.getByLabel('Yes, I would like to');
        this.newsletterRegistrationSuccessMessage = page.getByText('You have successfully subscribed to the newsletter.');
    }

    async goTo() {
        await this.page.goto('account');
    }
}
