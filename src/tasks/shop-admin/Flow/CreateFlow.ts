import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { FlowConfig } from '../../../types/ShopwareTypes';

export const CreateFlow = base.extend<{ CreateFlow: Task }, FixtureTypes>({
    CreateFlow: async ({ AdminFlowBuilderCreate, AdminFlowBuilderDetail, AdminFlowBuilderListing, ShopAdmin, TestDataService }, use ) => {
        const task = (flowConfig: FlowConfig) => {
            return async function createFlow() {
                await AdminFlowBuilderListing.createFlowButton.click();
                // Fill out fields on general tab
                await ShopAdmin.expects(AdminFlowBuilderCreate.smartBarHeader).toHaveText('New flow');
                await AdminFlowBuilderCreate.nameField.fill(`${flowConfig.name}`);
                await AdminFlowBuilderCreate.descriptionField.fill(`${flowConfig.description}`);
                await AdminFlowBuilderCreate.priorityField.fill(`${flowConfig.priority}`);
                if (flowConfig.active){
                    await AdminFlowBuilderCreate.activeSwitch.click();
                }
                // Switch to flow tab
                await AdminFlowBuilderCreate.flowTab.click();
                // Select trigger
                await AdminFlowBuilderCreate.triggerSelectField.fill(flowConfig.triggerSearchTerm);
                await AdminFlowBuilderCreate.triggerSelectField.press('Enter');
                // Add condition
                await AdminFlowBuilderCreate.sequenceSelectorConditionButton.click();
                await AdminFlowBuilderCreate.conditionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem.getByRole('listitem').filter({ hasText: `${flowConfig.condition}`}).click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.conditionSelectField, `${flowConfig.condition}`)).click();
                // Add action to condition true block
                await AdminFlowBuilderCreate.trueBlockAddActionButton.click();
                await AdminFlowBuilderCreate.trueBlockActionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem.getByRole('listitem').filter({ hasText: `${flowConfig.trueAction}` }).click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.trueBlockActionSelectField, `${flowConfig.trueAction}`)).click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.mailSendModal).toBeVisible();
                await AdminFlowBuilderCreate.mailSendModalTemplateSelectField.click();
                await AdminFlowBuilderCreate.resultListItem.waitFor({ state: 'visible' });
                await AdminFlowBuilderCreate.resultListItem.getByRole('listitem').filter({ hasText: `${flowConfig.trueActionIdentifier}`}).click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.mailSendModalTemplateSelectField, `${flowConfig.trueActionIdentifier}`)).click();
                await AdminFlowBuilderCreate.modalAddButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.trueBlockActionDescription).toContainText(`${flowConfig.trueActionIdentifier}`);
                // Add action to condition false block
                await AdminFlowBuilderCreate.falseBlockAddActionButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.falseBlockActionSelectField).toBeVisible();
                await AdminFlowBuilderCreate.falseBlockActionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem.getByRole('listitem').filter({ hasText: `${flowConfig.falseAction}` }).click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.falseBlockActionSelectField, `${flowConfig.falseAction}`)).click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.tagModal).toBeVisible();
                await AdminFlowBuilderCreate.tagModalTagsSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem.getByRole('listitem').filter({ hasText: `${flowConfig.falseActionIdentifier}`}).click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.tagModalTagsSelectField, `${flowConfig.falseActionIdentifier}`)).click();
                await AdminFlowBuilderCreate.modalAddButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.falseBlockActionDescription).toContainText(`Tag: ${flowConfig.falseActionIdentifier}`);
                await AdminFlowBuilderCreate.saveButton.click();
                await ShopAdmin.expects(AdminFlowBuilderDetail.successMessage).toBeVisible();
                const flowURL = AdminFlowBuilderDetail.page.url();
                const flowID = flowURL.split('/')[flowURL.split('/').length - 2];
                TestDataService.addCreatedRecord('flow', flowID);
            }
        };
        await use(task);
    },
});
