import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { translate } from '../../services/LanguageHelper';
import { satisfies } from 'compare-versions';

export class CustomerDetail implements PageObject {
    public readonly editButton: Locator;
    public readonly generalTab: Locator;
    public readonly addressesTab: Locator;
    public readonly ordersTab: Locator;
    public readonly accountCard: Locator;
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;
    public readonly customerGroupRequestMessage: Locator;
    public readonly customerGroupAcceptButton: Locator;
    public readonly customerGroupDeclineButton: Locator;
    public readonly tagList: Locator;
    public readonly tagItems: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];
    public readonly customerEmail: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.editButton = page.getByRole('button', { name: translate('administration:customer:detail.edit') });
        this.generalTab = page.getByRole('link', { name: 'General' });
        this.addressesTab = page.getByRole('tab', { name: translate('administration:customer:detail.addresses') });
        this.ordersTab = page.getByRole('tab', { name: translate('administration:customer:detail.orders') });
        this.accountCard = page.locator('.sw-customer-card');
        this.customerEmail = page.locator('.sw-customer-card-email-link');

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customFieldCard = page.locator('.sw-card').getByText(translate('administration:customField:general.customFields'));
        } else {
            this.customFieldCard = page.locator('.mt-card').getByText(translate('administration:customField:general.customFields'));
        }

        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customerGroupRequestMessage = page.locator('.sw-alert__message');
        } else {
            this.customerGroupRequestMessage = page.locator('.mt-banner__message');
        }

        this.customerGroupAcceptButton = page.getByRole('button', { name: translate('administration:customer:detail.accept') });
        this.customerGroupDeclineButton = page.getByRole('button', { name: translate('administration:customer:detail.decline') });
        this.tagList = page.locator('.sw-customer-card__tag-select').locator('.sw-select-selection-list');
        this.tagItems = this.tagList.locator('.sw-select-selection-list__item');
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {
        let customFieldCard: Locator;
        if (satisfies(this.instanceMeta.version, '<6.7')) {
            customFieldCard = this.page.locator('.sw-card').filter({ hasText: translate('administration:category:general.customFields') });
        } else {
            customFieldCard = this.page.locator('.mt-card').filter({ hasText: translate('administration:category:general.customFields') });
        }

        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        };
    }

    async getCustomerGroupAlert(customerGroup: string): Promise<Locator> {
        return this.customerGroupRequestMessage.getByText(translate('administration:customer:detail.customerGroupRequestMessage', { customerGroup }));
    }

    async getCustomerGroup(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: translate('administration:customer:detail.customerGroup') }),
        });
        return dlElement.locator('dd');
    }

    async getAccountStatus(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: translate('administration:customer:detail.accountStatus') }),
        });
        return dlElement.locator('dd');
    }

    async getLanguage(): Promise<Locator> {
        const dlElement = this.page.locator('dl').filter({
            has: this.page.locator('dt', { hasText: translate('administration:customer:detail.language') }),
        });
        return dlElement.locator('dd');
    }

    url(customerId: string) {
        return `#/sw/customer/detail/${customerId}/base`;
    }
}
