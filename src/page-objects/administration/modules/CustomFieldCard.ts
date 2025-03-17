import { type Page, type Locator } from '@playwright/test';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../../fixtures/HelperFixtures';

    /**
     * Returns locators for assigned custom fields on entity detail pages.
     *
     * @param page
     * @param instanceMeta
     * @param customFieldSetName
     * @param customFieldName
     * @returns Custom field locators on entity detail pages.
     */
    export async function getCustomFieldCardLocators(page: Page, customFieldSetName: string, customFieldName: string, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        let customFieldCard: Locator;
        if (satisfies(instanceMeta.version, '<6.7')) {
            customFieldCard = page.locator('.sw-card').filter({ hasText: 'Custom fields' });
        } else {
            customFieldCard = page.locator('.mt-card').filter({ hasText: 'Custom fields' });
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
