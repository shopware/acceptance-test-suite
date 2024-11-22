import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class CustomerDetail implements PageObject {
    public readonly editButton: Locator;
    public readonly generalTab: Locator;
    public readonly accountCard: Locator;
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;
    public readonly customerGroupRequestMessage: Locator;
    public readonly customerGroupAcceptButton: Locator;
    public readonly customerGroupDeclineButton: Locator;

    constructor(public readonly page: Page) {
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.generalTab = page.getByRole('link', { name: 'General' });
        this.accountCard = page.locator('.sw-customer-card');
        this.customFieldCard = page.locator('.sw-card').getByText('Custom fields');
        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
        this.customerGroupRequestMessage = page.locator('.sw-alert__message');
        this.customerGroupAcceptButton = page.getByRole('button', { name: 'Accept' });
        this.customerGroupDeclineButton = page.getByRole('button', { name: 'Decline' });
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {

        const customFieldCard = this.page.locator('.sw-card').filter({ hasText: 'Custom fields' });
        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);
    
        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        }
        
    }

    async getCustomerGroupAlert(customerGroup: string) : Promise<Locator> {
        return this.customerGroupRequestMessage.getByText(`Access to customer group "${customerGroup}" requested.`);
      }

    url(customerId: string) {
        return `#/sw/customer/detail/${customerId}/base`
    }
}