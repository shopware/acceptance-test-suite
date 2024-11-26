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
  public readonly enterTagsInput: Locator;

  //Custom fields
  public readonly customFieldCheckbox: Locator;
  public readonly customFieldInput: Locator;

  constructor(readonly page: Page){
    //General
    this.applyChangesButton = page.getByRole('button', { name: 'Apply changes' });
    this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    //Account
    this.changeCustomerGroupCheckbox = page.getByRole('checkbox', { name: 'Change: Customer group' });
    this.customerGroupInput = page.getByPlaceholder('Select customer group...');
    this.changeAccountStatusCheckbox = page.getByRole('checkbox', { name: 'Change: Account status' });
    this.accountStatusInput = page.getByPlaceholder('Change: Account status');
    this.changeLanguageCheckbox = page.getByRole('checkbox', { name: 'Change: Language' });
    this.changeLanguageInput = page.getByPlaceholder('Select language...');
    this.replyToCustomerGroupRequest = page.getByRole('checkbox', { name: 'Reply to: Customer group request' });
    this.replyToCustomerGroupRequestInput = page.getByPlaceholder('Select customer group request reply...');
    //Tags
    const changeTag = page.locator('.sw-bulk-edit-change-field-tags');
    this.changeTagsCheckbox = changeTag.getByRole('checkbox', { name: 'Change: Tags' });
    this.changeTypeSelect = changeTag.locator('.sw-bulk-edit-change-type__selection');
    this.enterTagsInput = changeTag.getByPlaceholder('Enter tags...');
    //Custom fields
    const customFields = page.locator('.sw-bulk-edit__custom-fields');
    this.customFieldCheckbox = customFields.getByRole('checkbox');
    this.customFieldInput = customFields.getByRole('textbox');
  }

  async getPageHeadline(customerCount: number): Promise<Locator> {
    return this.page.getByRole('heading', { name:`Bulk edit: ${customerCount} customer` })
  }

  async getCustomFieldInputByName(customFieldName: string): Promise<Locator> {
    return this.page.getByRole('textbox', { name: customFieldName });
  }

  url(): string {
    return '#/sw/bulk/edit/customer';
  }

}