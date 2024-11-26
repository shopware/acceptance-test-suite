import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CustomerListing implements PageObject {
    public readonly headline: Locator;
    public readonly addCustomerButton: Locator;

    constructor(public readonly page: Page) {
        this.headline = page.getByRole('heading', { name: 'Customers' });
        this.addCustomerButton = page.locator('.sw-customer-list__button-create');
    }

    async getCustomerByEmail(customerEmail: string): Promise<Record<string, Locator>> {

        const customer = this.page.getByRole('row').filter({ hasText: customerEmail });
        const customerName = customer.locator('.sw-data-grid__cell--firstName a');
        const customerStreet = customer.locator('.sw-data-grid__cell--defaultBillingAddress-street');
        const customerPostalCode = customer.locator('.sw-data-grid__cell--defaultBillingAddress-zipcode');
        const customerCity = customer.locator('.sw-data-grid__cell--defaultBillingAddress-city');
        const customerNumber = customer.locator('.sw-data-grid__cell--customerNumber')
        const customerGroup = customer.locator('.sw-data-grid__cell--group');
        const customerEmailAddress = customer.locator('.sw-data-grid__cell--email');

        return {
            customerName: customerName,
            customerStreet: customerStreet,
            customerPostalCode: customerPostalCode,
            customerCity: customerCity,
            customerNumber: customerNumber,
            customerGroup: customerGroup,
            customerEmailAddress: customerEmailAddress,
        }
    }

    url() {
        return '#/sw/customer/index';
    }
}