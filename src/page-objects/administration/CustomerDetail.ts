import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CustomerDetail implements PageObject {
    public readonly editButton: Locator;
    public readonly generalTab: Locator;
    public readonly accountCard: Locator;

    constructor(public readonly page: Page) {
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.generalTab = page.getByRole('link', { name: 'General' });
        this.accountCard = page.locator('.sw-customer-card')
    }

    url(customerId: string | undefined) {
        return `#/sw/customer/detail/${customerId}/base`
    }
}