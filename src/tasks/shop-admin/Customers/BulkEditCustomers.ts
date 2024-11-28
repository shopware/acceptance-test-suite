import { test as base } from '@playwright/test';
import { Task } from '../../../types/Task';
import { FixtureTypes } from '../../../types/FixtureTypes';

export const BulkEditCustomers = base.extend<{ BulkEditCustomers: Task }, FixtureTypes>({
    BulkEditCustomers: async ({ ShopAdmin, AdminCustomerListing, AdminCustomerBulkEdit  }, use ) => {
        const task = (customers, accountData?, tagData?, customFieldData?) => {
            return async function BulkEditCustomers() {
                const customerCount = customers.length;
                for (const customer of customers) {
                    const customerLineItem = await AdminCustomerListing.getCustomerByEmail(customer.email);
                    await customerLineItem.customerCheckbox.click();
                }
                await AdminCustomerListing.bulkEditButton.click();
                // Verify bulk edit modal
                await ShopAdmin.expects(AdminCustomerListing.bulkEditModal).toBeVisible();
                const modalTitle = await AdminCustomerListing.getCustomerBulkEditModalTitle(customerCount);
                await ShopAdmin.expects(modalTitle).toBeVisible();
                await ShopAdmin.expects(AdminCustomerListing.modalHeaderCheckbox).toBeChecked();

                // Start bulk edit
                await AdminCustomerListing.startBulkEditButton.click();
                await AdminCustomerListing.bulkEditModal.waitFor({ state: 'hidden' });
                const bulkEditPageHeadline = await AdminCustomerBulkEdit.getPageHeadline(customerCount);
                await ShopAdmin.expects(bulkEditPageHeadline).toBeVisible();
                if (accountData) {
                    if (accountData.customerGroup) {
                        await AdminCustomerBulkEdit.changeCustomerGroupCheckbox.click();
                        await AdminCustomerBulkEdit.customerGroupInput.click();
                        await AdminCustomerBulkEdit.filtersResultPopoverItemList.getByText(accountData.customerGroup).click();
                    }
                    if (accountData.accountStatus !== undefined) {
                        await AdminCustomerBulkEdit.changeAccountStatusCheckbox.click();
                        if (accountData.accountStatus) {
                            await AdminCustomerBulkEdit.accountStatusInput.click();
                        }
                    }
                    if (accountData.language) {
                        await AdminCustomerBulkEdit.changeLanguageCheckbox.click();
                        await AdminCustomerBulkEdit.changeLanguageInput.click();
                        await AdminCustomerBulkEdit.page.getByText(accountData.language).click();
                    }
                    if (accountData.replyToCustomerGroupRequest) {
                        await AdminCustomerBulkEdit.replyToCustomerGroupRequest.click();
                        await AdminCustomerBulkEdit.replyToCustomerGroupRequestInput.click();
                        await AdminCustomerBulkEdit.filtersResultPopoverItemList.getByText(accountData.replyToCustomerGroupRequest).click();
                    }
                }
                if (tagData) {
                    await AdminCustomerBulkEdit.changeTagsCheckbox.click();
                    await AdminCustomerBulkEdit.changeTypeSelect.click();
                    await AdminCustomerBulkEdit.page.getByText(tagData.changeType).click();
                    for (const tag of tagData.tags) {
                        await AdminCustomerBulkEdit.enterTagsSelect.click();
                        await AdminCustomerBulkEdit.page.getByText(tag).click();
                    }
                }
                if (customFieldData) {
                    const customFieldSet = await AdminCustomerBulkEdit.getCustomFieldLinkByName(customFieldData.customFieldSetName);
                    while (!await customFieldSet.isVisible()) {
                        await AdminCustomerBulkEdit.customFieldArrowRightButton.click();
                    }
                    await customFieldSet.click();
                    await AdminCustomerBulkEdit.customFieldCheckbox.click();
                    await AdminCustomerBulkEdit.customFieldInput.fill(customFieldData.customFieldValue);
                }
                await AdminCustomerBulkEdit.applyChangesButton.click();
                await AdminCustomerBulkEdit.confirmModalApplyChangesButton.click();
                await ShopAdmin.expects(AdminCustomerBulkEdit.confirmModalSuccessHeader).toBeVisible();
                await AdminCustomerBulkEdit.confirmModalSuccessCloseButton.click();
            }
        }

        await use(task);
    },
});
