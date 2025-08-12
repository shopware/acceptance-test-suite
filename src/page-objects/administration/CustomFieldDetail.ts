import type { Page, Locator } from 'playwright-core';
import { CustomFieldCreate } from './CustomFieldCreate';
import { getSelectFieldListitem } from './modules/SelectFieldListitem';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class CustomFieldDetail extends CustomFieldCreate {
    public readonly newCustomFieldButton: Locator;
    public readonly customFieldEditDialog: Locator;
    public readonly newCustomFieldDialog: Locator;
    public readonly customFieldTechnicalNameInput: Locator;
    public readonly customFieldPositionInput: Locator;
    public readonly customFieldTypeSelectionList: Locator;
    public readonly customFieldModifyByStoreApiCheckbox: Locator;
    public readonly customFieldCancelButton: Locator;
    public readonly customFieldAddButton: Locator;
    public readonly customFieldEditApplyButton: Locator;
    public readonly customFieldLabelEnglishGBInput: Locator;
    public readonly customFieldPlaceholderEnglishGBInput: Locator;
    public readonly customFieldHelpTextEnglishGBInput: Locator;
    public readonly customFieldDeleteListButton: Locator;
    public readonly customFieldDeleteDialog: Locator;
    public readonly customFieldDeleteCancelButton: Locator;
    public readonly customFieldDeleteButton: Locator;
    public readonly customFieldEditAvailableInShoppingCartCheckbox: Locator;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page);
        this.instanceMeta = instanceMeta;

        //Custom field section
        this.newCustomFieldButton = page.getByRole('button', { name: 'New custom field' });
        this.customFieldDeleteListButton = page.locator('.sw-custom-field-list__delete-button');

        //Dialog - New custom field / Edit custom field
        this.newCustomFieldDialog = page.getByRole('dialog', { name: 'New custom field' });
        this.customFieldAddButton = this.newCustomFieldDialog.getByRole('button', { name: 'Add' });
        this.customFieldTechnicalNameInput = this.newCustomFieldDialog.getByLabel('Technical name');
        this.customFieldPositionInput = this.newCustomFieldDialog.getByLabel('Position');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customFieldTypeSelectionList = this.newCustomFieldDialog.getByLabel('Type');
        } else {
            this.customFieldTypeSelectionList = this.newCustomFieldDialog.getByRole('textbox', { name: 'Select...' });
        }
        this.customFieldModifyByStoreApiCheckbox = this.newCustomFieldDialog.getByLabel('Modifiable via Store API');
        this.customFieldCancelButton = this.newCustomFieldDialog.getByRole('button', { name: 'Cancel' });
        this.customFieldLabelEnglishGBInput = this.newCustomFieldDialog.getByLabel('Label (English (GB))');
        this.customFieldPlaceholderEnglishGBInput = this.newCustomFieldDialog.getByLabel('Placeholder (English (GB))');
        this.customFieldHelpTextEnglishGBInput = this.newCustomFieldDialog.getByLabel('Help text (English (GB))');
        this.customFieldEditDialog = page.getByRole('dialog', { name: 'Edit custom field' });
        this.customFieldEditAvailableInShoppingCartCheckbox = this.customFieldEditDialog.getByLabel('Available in shopping cart');
        this.customFieldEditApplyButton = this.customFieldEditDialog.getByRole('button', { name: 'Apply changes' });

        //Dialog - delete field
        this.customFieldDeleteDialog = page.getByRole('dialog', { name: 'Delete custom field' });
        this.customFieldDeleteCancelButton = this.customFieldDeleteDialog.getByRole('button', { name: 'Cancel' });
        this.customFieldDeleteButton = this.customFieldDeleteDialog.getByRole('button', { name: 'Delete' });
    }

    async getLineItemByCustomFieldName(customFieldName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole('row').filter({ hasText: customFieldName });
        const customFieldCheckbox = lineItem.locator('.icon--regular-checkmark-xxs');
        const customFieldLabelText = lineItem.getByRole('textbox');
        const customFieldContextButton = lineItem.locator('.sw-context-button__button');
        const customFieldEditButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Edit'});
        const customFieldDeleteButton = this.page.locator('.sw-context-menu__content').getByRole('link', { name: 'Delete'});
        const warningDialog = this.page.getByRole('dialog', { name: 'Delete custom field' });
        const warningDialogCancelButton = warningDialog.getByRole('button', { name: 'Cancel' });
        const warningDialogDeleteButton = warningDialog.getByRole('button', { name: 'Delete' });

        return {
            customFieldLabelText: customFieldLabelText,
            customFieldCheckbox: customFieldCheckbox,
            customFieldContextButton: customFieldContextButton,
            customFieldEditButton: customFieldEditButton,
            customFieldDeleteButton: customFieldDeleteButton,
            warningDialog: warningDialog,
            warningDialogCancelButton: warningDialogCancelButton,
            warningDialogDeleteButton: warningDialogDeleteButton,
        }
    }

    url(customFieldUuid?: string) {
        return `#/sw/settings/custom/field/detail/${customFieldUuid}`
    }
    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}