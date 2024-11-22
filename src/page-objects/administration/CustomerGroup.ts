import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CustomerGroup implements PageObject {
    public readonly headline: Locator;
    public readonly addCustomerGroupButton: Locator;

    constructor(public readonly page: Page) {
        this.headline = page.getByRole('heading', { name: 'Customer groups' });
        this.addCustomerGroupButton = page.locator('.sw-settings-customer-group-list__create');
    }

    async getCustomerGroupByName(customerGroup: string): Promise<Record<string, Locator>> {
        
        const lineItem = this.page.getByRole('row').filter({ hasText: customerGroup });
        const customerGroupCheckbox = lineItem.locator('.sw-data-grid__cell--selection');
        const customerGroupName = lineItem.locator('.sw-data-grid__cell--name');
        const customerGroupTaxDisplay = lineItem.locator('.sw-data-grid__cell--displayGross');
        const customerGroupActionButton = lineItem.locator('.sw-data-grid__actions-menu');
        
        return {
            customerGroupCheckbox: customerGroupCheckbox,
            customerGroupName: customerGroupName,
            customerGroupTaxDisplay: customerGroupTaxDisplay,
            customerGroupActionButton: customerGroupActionButton,
        }
    }

    url() {
        return '#/sw/settings/customer/group/index'
    }
}