import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class CustomFieldCreate implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly technicalNameInput: Locator;
    public readonly positionInput: Locator;
    public readonly labelEnglishGBInput: Locator;
    public readonly assignToSelectionList: Locator;
    public readonly resultAssignToPopoverItemList: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.saveButton = page.getByRole('button', { name: translate('administration:customField:create.save') });
        this.cancelButton = page.getByRole('button', { name: translate('administration:customField:create.cancel') });
        this.technicalNameInput = page.getByLabel(translate('administration:customField:common.technicalName'));
        this.positionInput = page.getByLabel(translate('administration:customField:common.position'));
        this.labelEnglishGBInput = page.getByLabel(translate('administration:customField:common.labelEnglishGB'));
        this.assignToSelectionList = page
            .locator('.sw-field')
            .filter({ hasText: translate('administration:customField:create.assignTo') })
            .locator('.sw-select__selection');
        this.resultAssignToPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    }

    url() {
        return `#/sw/settings/custom/field/create`;
    }
}
