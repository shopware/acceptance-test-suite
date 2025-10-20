import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';
import { getSelectFieldListitem } from './modules/SelectFieldListitem';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class RuleCreate implements PageObject {
    public readonly header: Locator;
    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;
    public readonly descriptionInput: Locator;
    public readonly typeItem: Locator;
    public readonly tagItem: Locator;
    public readonly conditionTypeSelectionInput: Locator;
    public readonly conditionValueSelectionInput: Locator;
    public readonly filtersResultPopoverSelectionList: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly smartBarHeader: Locator;
    public readonly valueNotAvailableTooltip: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.header = page.locator('.smart-bar__header');
        this.nameInput = page.getByLabel(translate('administration:rule:fields.name'));
        this.priorityInput = page.getByLabel(translate('administration:rule:fields.priority'));
        this.descriptionInput = page.getByLabel('Description');
        this.typeItem = page.locator('.sw-settings-rule-detail__type-field').locator('.sw-select-selection-list__item');
        this.tagItem = page.locator('.sw-settings-rule-detail__tags-field').locator('.sw-select-selection-list__item');
        this.conditionTypeSelectionInput = page.locator('.sw-condition-type-select').locator('.sw-single-select__selection');
        this.conditionValueSelectionInput = page.locator('.sw-condition__value-content').locator('.sw-entity-single-select__selection');
        this.filtersResultPopoverSelectionList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.saveButton = page.getByRole('button', { name: translate('administration:rule:buttons.save') });
        this.cancelButton = page.getByRole('button', { name: translate('administration:rule:buttons.cancel') });
        this.smartBarHeader = page.locator('.smart-bar__header');
        this.valueNotAvailableTooltip = page.locator('.sw-tooltip');
    }

    url() {
        return `#/sw/settings/rule/create/base`;
    }
    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}
