import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleCreate implements PageObject {

    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;
    public readonly descriptionInput: Locator;
    public readonly typeInput: Locator;
    public readonly tagInput: Locator;
    public readonly conditionTypeSelectionInput: Locator;
    public readonly conditionValueSelectionInput: Locator;
    public readonly filtersResultPopoverSelectionList: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly smartBarHeader: Locator;

    constructor(public readonly page: Page) {
        this.nameInput = page.getByLabel('Name');
        this.priorityInput = page.getByLabel('Priority');
        this.descriptionInput = page.locator('.sw-block-field__block').getByLabel('Description');
        this.typeInput = page.locator('.sw-select__selection').getByLabel('Type');
        this.tagInput = page.locator('.sw-select__selection').getByLabel('Tags');

        this.conditionTypeSelectionInput = page.locator('.sw-condition-type-select').locator('.sw-single-select__selection');
        this.conditionValueSelectionInput = page.locator('.sw-condition__value-content').locator('.sw-entity-single-select__selection');
        this.filtersResultPopoverSelectionList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.smartBarHeader = page.locator('.smart-bar__header');
    }

    url() {
        return `#/sw/settings/rule/create/base`
    }
}