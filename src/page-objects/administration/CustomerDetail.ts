import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

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
    public readonly tagList: Locator;
    public readonly tagItems: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.generalTab = page.getByRole('link', { name: 'General' });
        this.accountCard = page.locator('.sw-customer-card');

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customFieldCard = page.locator('.sw-card').getByText('Custom fields');
        } else {
            this.customFieldCard = page.locator('.mt-card').getByText('Custom fields');
        }

        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customerGroupRequestMessage = page.locator('.sw-alert__message');
        } else {
            this.customerGroupRequestMessage = page.locator('.mt-banner__message');
        }

        this.customerGroupAcceptButton = page.getByRole('button', { name: 'Accept' });
        this.customerGroupDeclineButton = page.getByRole('button', { name: 'Decline' });
        this.tagList = page.locator('.sw-customer-card__tag-select').locator('.sw-select-selection-list');
        this.tagItems = this.tagList.locator('.sw-select-selection-list__item');
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {
        let customFieldCard: Locator;
        if (satisfies(this.instanceMeta.version, '<6.7')) {
            customFieldCard = this.page.locator('.sw-card').filter({ hasText: 'Custom fields' });
        } else {
            customFieldCard = this.page.locator('.mt-card').filter({ hasText: 'Custom fields' });
        }

        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        }

    }

    async getCustomerGroupAlert(customerGroup: string): Promise<Locator> {
        return this.customerGroupRequestMessage.getByText(`Access to customer group "${customerGroup}" requested.`);
    }

    async getCustomerGroup(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: 'Customer group' }),
        });
        return dlElement.locator('dd');
    }

    async getAccountStatus(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: 'Account status' }),
        });
        return dlElement.locator('dd');
    }

    async getLanguage(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: 'Language' }),
        });
        return dlElement.locator('dd');
    }

    url(customerId: string) {
        return `#/sw/customer/detail/${customerId}/base`;
    }
}