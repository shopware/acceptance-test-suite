import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import {CustomFieldLocators} from "./modules/CustomFields";
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class CategoryDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;
    public readonly customFieldLocators: CustomFieldLocators;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customFieldCard = page.locator('.sw-card').getByText('Custom fields');
        } else {
            this.customFieldCard = page.locator('.mt-card').getByText('Custom fields');
        }

        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
        this.customFieldLocators = new CustomFieldLocators(page);
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

    url(categoryUuid: string) {
        return `#/sw/category/index/${categoryUuid}/base`
    }

    async customFields(customFieldSetName: string, customFieldTextName: string) {
        return await this.customFieldLocators.getLocators(customFieldSetName, customFieldTextName);
    }
}