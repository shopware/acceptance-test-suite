import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { getSelectFieldListitem } from './modules/SelectFieldListitem';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class RuleCreate implements PageObject {

    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;
    public readonly conditionTypeSelectionInput: Locator;
    public readonly conditionValueSelectionInput: Locator;
    public readonly filtersResultPopoverSelectionList: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly valueNotAvailableTooltip: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.nameInput = page.getByLabel('Name');
        this.priorityInput = page.getByLabel('Priority');
        this.conditionTypeSelectionInput = page.locator('.sw-condition-type-select').locator('.sw-single-select__selection');
        this.conditionValueSelectionInput = page.locator('.sw-condition__value-content').locator('.sw-entity-single-select__selection');
        this.filtersResultPopoverSelectionList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.valueNotAvailableTooltip = page.locator('.sw-tooltip');
    }

    url() {
        return `#/sw/settings/rule/create/base`
    }
    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}