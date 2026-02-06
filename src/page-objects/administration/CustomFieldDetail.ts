import type { Page, Locator } from "playwright-core";
import { CustomFieldCreate } from "./CustomFieldCreate";
import { getSelectFieldListitem } from "./modules/SelectFieldListitem";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { satisfies } from "compare-versions";
import { translate } from "../../services/LanguageHelper";

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
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        super(page);
        this.instanceMeta = instanceMeta;

        //Custom field section
        this.newCustomFieldButton = page.getByRole("button", { name: translate("administration:customField:detail.newCustomField") });
        this.customFieldDeleteListButton = page.locator(".sw-custom-field-list__delete-button");

        //Dialog - New custom field / Edit custom field
        this.newCustomFieldDialog = page.getByRole("dialog", { name: translate("administration:customField:detail.newCustomField") });
        this.customFieldAddButton = this.newCustomFieldDialog.getByRole("button", { name: translate("administration:customField:detail.add") });
        this.customFieldTechnicalNameInput = this.newCustomFieldDialog.getByLabel(translate("administration:customField:common.technicalName"));
        this.customFieldPositionInput = this.newCustomFieldDialog.getByLabel(translate("administration:customField:common.position"));
        if (satisfies(instanceMeta.version, "<6.7")) {
            this.customFieldTypeSelectionList = this.newCustomFieldDialog.getByLabel(translate("administration:customField:detail.type"));
        } else {
            this.customFieldTypeSelectionList = this.newCustomFieldDialog.getByRole("textbox", { name: translate("administration:customField:detail.select") });
        }
        this.customFieldModifyByStoreApiCheckbox = this.newCustomFieldDialog.getByLabel(translate("administration:customField:detail.modifiableViaStoreApi"));
        this.customFieldCancelButton = this.newCustomFieldDialog.getByRole("button", { name: translate("administration:customField:actions.cancel") });
        this.customFieldLabelEnglishGBInput = this.newCustomFieldDialog.getByLabel(translate("administration:customField:common.labelEnglishGB"));
        this.customFieldPlaceholderEnglishGBInput = this.newCustomFieldDialog.getByLabel(translate("administration:customField:detail.placeholderEnglishGB"));
        this.customFieldHelpTextEnglishGBInput = this.newCustomFieldDialog.getByLabel(translate("administration:customField:detail.helpTextEnglishGB"));
        this.customFieldEditDialog = page.getByRole("dialog", { name: translate("administration:customField:detail.editCustomField") });
        this.customFieldEditAvailableInShoppingCartCheckbox = this.customFieldEditDialog.getByLabel(translate("administration:customField:detail.availableInShoppingCart"));
        this.customFieldEditApplyButton = this.customFieldEditDialog.getByRole("button", { name: translate("administration:customField:actions.applyChanges") });

        //Dialog - delete field
        this.customFieldDeleteDialog = page.getByRole("dialog", { name: translate("administration:customField:dialogs.deleteCustomField") });
        this.customFieldDeleteCancelButton = this.customFieldDeleteDialog.getByRole("button", { name: translate("administration:customField:actions.cancel") });
        this.customFieldDeleteButton = this.customFieldDeleteDialog.getByRole("button", { name: translate("administration:customField:actions.delete") });
    }

    async getLineItemByCustomFieldName(customFieldName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole("row").filter({ hasText: customFieldName });
        const customFieldCheckbox = lineItem.locator(".icon--regular-checkmark-xxs");
        const customFieldLabelText = lineItem.getByRole("textbox");
        const customFieldContextButton = lineItem.locator(".sw-context-button__button");
        const customFieldEditButton = this.page.locator(".sw-context-menu__content").getByRole("link", { name: translate("administration:customField:actions.edit") });
        const customFieldDeleteButton = this.page.locator(".sw-context-menu__content").getByRole("link", { name: translate("administration:customField:actions.delete") });
        const warningDialog = this.page.getByRole("dialog", { name: translate("administration:customField:dialogs.deleteCustomField") });
        const warningDialogCancelButton = warningDialog.getByRole("button", { name: translate("administration:customField:actions.cancel") });
        const warningDialogDeleteButton = warningDialog.getByRole("button", { name: translate("administration:customField:actions.delete") });

        return {
            customFieldLabelText: customFieldLabelText,
            customFieldCheckbox: customFieldCheckbox,
            customFieldContextButton: customFieldContextButton,
            customFieldEditButton: customFieldEditButton,
            customFieldDeleteButton: customFieldDeleteButton,
            warningDialog: warningDialog,
            warningDialogCancelButton: warningDialogCancelButton,
            warningDialogDeleteButton: warningDialogDeleteButton,
        };
    }

    url(customFieldUuid?: string) {
        return `#/sw/settings/custom/field/detail/${customFieldUuid}`;
    }
    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}
