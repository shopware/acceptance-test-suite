import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { satisfies } from 'compare-versions';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { getCustomFieldCardLocators } from './modules/CustomFieldCard';
import { translate } from '../../services/LanguageHelper';

export class CategoryDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.saveButton = page.getByRole('button', { name: translate('administration:category:general.save') });
        this.cancelButton = page.getByRole('button', { name: translate('administration:category:general.cancel') });

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customFieldCard = page.locator('.sw-card').getByText(translate('administration:category:general.customFields'));
        } else {
            this.customFieldCard = page.locator('.mt-card').getByText(translate('administration:category:general.customFields'));
        }

        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
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

    url(categoryUuid: string) {
        return `#/sw/category/index/${categoryUuid}/base`;
    }

    async getCustomFieldCardLocators(customFieldSetName: string, customFieldTextName: string) {
        return getCustomFieldCardLocators(this.page, customFieldSetName, customFieldTextName, this.instanceMeta);
    }
}
