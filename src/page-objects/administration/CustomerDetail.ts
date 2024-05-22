import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import type { components } from '@shopware/api-client/admin-api-types';

export class CustomerDetail implements PageObject {
    public readonly customerId;
    public readonly customer: components['schemas']['Customer'];

    public readonly editButton: Locator;
    public readonly generalTab: Locator;
    public readonly accountCard: Locator;

    constructor(public readonly page: Page, customer: components['schemas']['Customer'] ) {
        this.customerId = customer.id;
        this.customer = customer;
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.generalTab = page.getByRole('link', { name: 'General' });
        this.accountCard = page.locator('.sw-customer-card')
    }

    async goTo() {
        await this.page.goto(`#/sw/customer/detail/${this.customerId}/base`);
    }
}