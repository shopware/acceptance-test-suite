import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class Account implements PageObject {
    public readonly headline: Locator;
    public readonly personalDataCardTitle: Locator;
    public readonly paymentMethodCardTitle: Locator;
    public readonly billingAddressCardTitle: Locator;
    public readonly shippingAddressCardTitle: Locator;
    public readonly newsletterCheckbox: Locator;
    public readonly newsletterRegistrationSuccessMessage: Locator;
    public readonly customerGroupRequestMessage: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.headline = page.getByRole('heading', { name: 'Overview' });
        this.personalDataCardTitle = page.getByRole('heading', { name: 'Personal data' });
        this.paymentMethodCardTitle = page.getByRole('heading', { name: 'Default payment method' });
        this.billingAddressCardTitle = page.getByRole('heading', { name: 'Default billing address' });
        this.shippingAddressCardTitle = page.getByRole('heading', { name: 'Default shipping address' });
        this.newsletterCheckbox = page.getByLabel('Yes, I would like to');
        this.newsletterRegistrationSuccessMessage = page.getByText('You have successfully subscribed to the newsletter.');

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customerGroupRequestMessage = page.locator('.alert-content');
        } else {
            this.customerGroupRequestMessage = page.locator('.alert-content-container');
        }
        
    }

    async getCustomerGroupAlert(customerGroup: string): Promise<Locator> {
        return this.customerGroupRequestMessage.getByText(`Access to customer group "${customerGroup}" requested.`);
    }

    url() {
        return 'account';
    }
}
