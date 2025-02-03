import { type Page, type Locator } from '@playwright/test';

/**
 * Returns the locator for a list item on a select field's result list.
 *
 * @param pageObject - Page object that contains the select field.
 * @param selectField - Locator for the select field.
 * @param listItem - List item to select.
 * @returns The locator for the list item.
 */
export const getResultListItem = async (pageObject: Page, selectField: Locator, listItem: string): Promise<Locator> => {
    await selectField.click();
    await pageObject.locator('.sw-select-result-list__item-list').waitFor({ state: 'visible' });
    return pageObject.locator('.sw-select-result-list__content').getByRole('listitem').filter({ hasText: listItem });
};

/**
 * Returns locators for assigned custom fields on entity detail pages.
 *
 * @param pageObject
 * @param customFieldSetName
 * @param customFieldName
 * @returns Custom field locators on entity detail pages.
 */
export const getCustomFieldCardContent = async (pageObject: Page, customFieldSetName: string, customFieldName: string): Promise<Record<string, Locator>> => {

    const customFieldCard = pageObject.locator('.sw-card').filter({ hasText: 'Custom fields' });
    const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
    const customFieldLabel = customFieldCard.locator('.sw-custom-field-set-renderer').locator('.sw-field__label').getByText(customFieldName);
    const customFieldSelect = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

    return {
        customFieldCard: customFieldCard,
        customFieldSetsTab: customFieldSetTab,
        customFieldLabel: customFieldLabel,
        customFieldSelect: customFieldSelect,
    }
}