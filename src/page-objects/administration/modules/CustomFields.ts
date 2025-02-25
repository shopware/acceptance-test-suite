import { type Page, type Locator } from '@playwright/test';
import {satisfies} from 'compare-versions';
import { HelperFixtureTypes } from '../../../fixtures/HelperFixtures';

export class CustomFieldLocators {
    private page: Page;

    constructor(page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
    }

    /**
     * Returns locators for assigned custom fields on entity detail pages.
     *
     * @param customFieldSetName
     * @param customFieldName
     * @returns Custom field locators on entity detail pages.
     */
    async getLocators(customFieldSetName: string, customFieldName: string): Promise<{ customFieldCard: Locator, customFieldSetTab: Locator, customFieldLabel: Locator, customFieldSelect: Locator }> {
        let customFieldCard: Locator;
        if (satisfies(this.instanceMeta.version, '<6.7')) {
            customFieldCard = this.page.locator('.sw-card').filter({ hasText: 'Custom fields' });
        } else {
            customFieldCard = this.page.locator('.mt-card').filter({ hasText: 'Custom fields' });
        }
        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldLabel = customFieldCard.locator('.sw-custom-field-set-renderer').locator('.sw-field__label').getByText(customFieldName);
        const customFieldSelect = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldCard,
            customFieldSetTab,
            customFieldLabel,
            customFieldSelect,
        };
    }
}