import type { Page, Locator } from 'playwright-core';
import { satisfies } from 'compare-versions';
import type { HelperFixtureTypes } from '../../../fixtures/HelperFixtures';
import { translate } from '../../../services/LanguageHelper';

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
    let customFieldLabel: Locator;
    if (satisfies(instanceMeta.version, '<6.7')) {
        customFieldCard = page.locator('.sw-card').filter({ hasText: translate('administration:customField:general.customFields') });
    } else {
        customFieldCard = page.locator('.mt-card').filter({ hasText: translate('administration:customField:general.customFields') });
    }
    const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
    if (satisfies(instanceMeta.version, '<6.7.4.1')) {
        customFieldLabel = customFieldCard.locator('.sw-custom-field-set-renderer').locator('.sw-field__label').getByText(customFieldName);
    } else {
        customFieldLabel = customFieldCard.locator('.sw-custom-field-set-renderer').locator('.mt-field__label').getByText(customFieldName);
    }
    const customFieldSelect = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

    return {
        customFieldCard,
        customFieldSetTab,
        customFieldLabel,
        customFieldSelect,
    };
}
