import { PageObject } from '../../types/PageObject';
import { Locator, Page } from '@playwright/test';

export class CustomerBulkEdit implements PageObject{

  //General
  public readonly applyChangesButton: Locator;
  public readonly filtersResultPopoverItemList: Locator;

  //Account
  public readonly changeCustomerGroupCheckbox: Locator;
  public readonly customerGroupInput: Locator;
  public readonly changeAccountStatusCheckbox: Locator;
  public readonly accountStatusInput: Locator;
  public readonly changeLanguageCheckbox: Locator;
  public readonly changeLanguageInput: Locator;
  public readonly replyToCustomerGroupRequest: Locator;
  public readonly replyToCustomerGroupRequestInput: Locator;

  //Tags
  public readonly changeTagsCheckbox: Locator;
  public readonly changeTypeSelect: Locator;
  public readonly enterTagsSelect: Locator;

  //Custom fields
  public readonly customFieldCheckbox: Locator;
  public readonly customFieldInput: Locator;
  public readonly customFieldArrowRightButton: Locator;

  /**
   * Confirmation modal
   */
  public readonly confirmModal: Locator;
  public readonly confirmModalApplyChangesButton: Locator;
  public readonly confirmModalSuccessHeader: Locator;
  public readonly confirmModalSuccessCloseButton: Locator;

  constructor(readonly page: Page){
    //General
    this.applyChangesButton = page.getByRole('button', { name: 'Apply changes' });
    this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    //Account
    this.changeCustomerGroupCheckbox = page.getByRole('checkbox', { name: 'Change: Customer group' });
    this.customerGroupInput = page.locator('.sw-select').filter({ hasText: 'Select customer group...' }).locator('.sw-select__selection');
    const accountStatus = page.locator('.sw-bulk-edit-change-field-active');
    this.changeAccountStatusCheckbox = accountStatus.getByRole('checkbox', { name: 'Change: Account status' });
    this.accountStatusInput = accountStatus.locator('.sw-field--switch__input');
    this.changeLanguageCheckbox = page.getByRole('checkbox', { name: 'Change: Language' });
    this.changeLanguageInput = page.locator('.sw-select').filter({ hasText: 'Select language...' }).locator('.sw-select__selection');
    this.replyToCustomerGroupRequest = page.getByRole('checkbox', { name: 'Reply to: Customer group request' });
    this.replyToCustomerGroupRequestInput = page.locator('.sw-select').filter({ hasText: 'Select customer group request reply...' }).locator('.sw-select__selection');
    //Tags
    const changeTag = page.locator('.sw-bulk-edit-change-field-tags');
    this.changeTagsCheckbox = changeTag.getByRole('checkbox', { name: 'Change: Tags' });
    this.changeTypeSelect = changeTag.locator('.sw-bulk-edit-change-type__selection');
    this.enterTagsSelect = changeTag.locator('.sw-entity-multi-select');

    //Custom fields
    const customFields = page.locator('.sw-bulk-edit__custom-fields');
    this.customFieldArrowRightButton = customFields.locator('.sw-tabs__arrow--right');
    this.customFieldCheckbox = customFields.getByRole('checkbox');
    this.customFieldInput = customFields.getByRole('textbox');

    //Confirmation modal
    this.confirmModal = page.locator('.sw-bulk-edit-save-modal');
    this.confirmModalApplyChangesButton = this.confirmModal.getByRole('button', {name: 'Apply changes'});
    this.confirmModalSuccessHeader = this.confirmModal.getByRole('heading', {name: 'Bulk edit - Success'});
    const footer = this.confirmModal.locator('.sw-modal__footer');
    this.confirmModalSuccessCloseButton = footer.getByRole('button', {name: 'Close'});
  }

  async getPageHeadline(customerCount: number): Promise<Locator> {
    return this.page.getByRole('heading', { name:`Bulk edit: ${customerCount} customer` })
  }

  async getCustomFieldInputByName(customFieldName: string): Promise<Locator> {
    return this.page.getByRole('textbox', { name: customFieldName });
  }

  async getCustomFieldLinkByName(customFieldSetName: string): Promise<Locator> {
    return this.page.locator('a').filter({
      hasText: `${customFieldSetName}`,
    });
  }

  url(): string {
    return '#/sw/bulk/edit/customer';
  }

}