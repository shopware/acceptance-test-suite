import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CustomFieldCreate implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly technicalNameInput: Locator;
    public readonly positionInput: Locator;
    public readonly labelEnglishGBInput: Locator;
    public readonly assignToSelectionList: Locator;
    public readonly resultAssignToPopoverItemList: Locator
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.technicalNameInput = page.getByLabel('Technical name');
        this.positionInput = page.getByLabel('Position');
        this.labelEnglishGBInput = page.getByLabel('Label (English (GB))');
        this.assignToSelectionList = page.locator('.sw-field')
            .filter({ hasText: 'Assign To' })
            .locator('.sw-select__selection');
        this.resultAssignToPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    }

    url() {
        return `#/sw/settings/custom/field/create`
    }
}