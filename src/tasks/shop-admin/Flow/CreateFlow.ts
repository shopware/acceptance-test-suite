import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import type { FlowConfig } from "../../../types/ShopwareTypes";
import { translate } from "../../../services/LanguageHelper";

export const CreateFlow = base.extend<{ CreateFlow: Task }, FixtureTypes>({
    CreateFlow: async ({ AdminFlowBuilderCreate, AdminFlowBuilderDetail, AdminFlowBuilderListing, ShopAdmin, TestDataService }, use) => {
        const task = (flowConfig: FlowConfig) => {
            return async function createFlow() {
                await ShopAdmin.expects(AdminFlowBuilderListing.createFlowButton).toBeEnabled();
                // Listens for the flow-actions.json response to ensure the action dropdown is populated once it is needed.
                const flowActionsLoaded = AdminFlowBuilderCreate.page.waitForResponse((response) => response.url().includes("/_info/flow-actions.json") && response.ok());
                // The lazy-loaded listing writes its default query (limit, page, ...) to the route via router.replace once it is created.
                // A click before that would start a navigation that the replace silently cancels, so wait for the query first.
                // Might require refactoring once https://github.com/shopware/shopware/issues/21159 is resolved.
                await ShopAdmin.expects(AdminFlowBuilderListing.page).toHaveURL(/#\/sw\/flow\/index\/.*[?&]limit=/);
                const navigatedToCreate = AdminFlowBuilderCreate.page.waitForURL((url) => url.hash.includes("/sw/flow/create/"));
                await AdminFlowBuilderListing.createFlowButton.click();
                await navigatedToCreate;
                await ShopAdmin.expects(AdminFlowBuilderCreate.skeletonLoader).toHaveCount(0);
                // Fill out fields on general tab
                await ShopAdmin.expects(AdminFlowBuilderCreate.smartBarHeader).toHaveText(translate("administration:flowBuilder:create.newFlow"));
                await AdminFlowBuilderCreate.nameField.fill(`${flowConfig.name}`);
                await AdminFlowBuilderCreate.descriptionField.fill(`${flowConfig.description}`);
                await AdminFlowBuilderCreate.priorityField.fill(`${flowConfig.priority}`);
                if (flowConfig.active) {
                    await AdminFlowBuilderCreate.activeSwitch.click();
                }
                // Switch to flow tab
                await AdminFlowBuilderCreate.flowTab.click();
                // Select trigger
                await AdminFlowBuilderCreate.triggerSelectField.fill(flowConfig.triggerSearchTerm);
                await AdminFlowBuilderCreate.triggerSelectField.press("Enter");
                // Add condition
                await AdminFlowBuilderCreate.sequenceSelectorConditionButton.click();
                // todo: As soon as conditionSelectField is migrated to Meteor, remove the following three lines and use the commented line instead.
                await AdminFlowBuilderCreate.conditionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem
                    .getByRole("listitem")
                    .filter({ hasText: `${flowConfig.condition}` })
                    .click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.conditionSelectField, `${flowConfig.condition}`)).click();
                // Add action to condition true block
                await flowActionsLoaded;
                await AdminFlowBuilderCreate.trueBlockAddActionButton.click();
                // todo: As soon as trueBlockActionSelectField is migrated to Meteor, remove the following three lines and use the commented line instead.
                await AdminFlowBuilderCreate.trueBlockActionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem
                    .getByRole("listitem")
                    .filter({ hasText: `${flowConfig.trueAction}` })
                    .click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.trueBlockActionSelectField, `${flowConfig.trueAction}`)).click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.mailSendModal).toBeVisible();
                // todo: As soon as mailSendModalTemplateSelectField is migrated to Meteor, remove the following three lines and use the commented line instead.
                await AdminFlowBuilderCreate.mailSendModalTemplateSelectField.click();
                await AdminFlowBuilderCreate.resultListItem.waitFor({ state: "visible" });
                await AdminFlowBuilderCreate.resultListItem
                    .getByRole("listitem")
                    .filter({ hasText: `${flowConfig.trueActionIdentifier}` })
                    .click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.mailSendModalTemplateSelectField, `${flowConfig.trueActionIdentifier}`)).click();
                await AdminFlowBuilderCreate.modalAddButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.trueBlockActionDescription).toContainText(`${flowConfig.trueActionIdentifier}`);
                // Add action to condition false block
                await AdminFlowBuilderCreate.falseBlockAddActionButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.falseBlockActionSelectField).toBeVisible();
                // todo: As soon as falseBlockActionSelectField is migrated to Meteor, remove the following three lines and use the commented line instead.
                await AdminFlowBuilderCreate.falseBlockActionSelectField.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem
                    .getByRole("listitem")
                    .filter({ hasText: `${flowConfig.falseAction}` })
                    .click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.falseBlockActionSelectField, `${flowConfig.falseAction}`)).click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.tagModal).toBeVisible();
                // todo: As soon as tagModalTagsSelectField is migrated to Meteor, remove the following block and use the commented line instead.
                // Opening the select loads the first unfiltered page of tags (limit 25). Typing before it finishes can drop the term search,
                // leaving a list that may not contain the tag. Wait for the initial load, then for the term search.
                const tagsLoaded = AdminFlowBuilderCreate.page.waitForResponse((response) => response.url().includes("/search/tag") && response.request().method() === "POST");
                await AdminFlowBuilderCreate.tagModalTagsSelectField.click();
                ShopAdmin.expects((await tagsLoaded).ok()).toBeTruthy();
                const tagSearched = AdminFlowBuilderCreate.page.waitForResponse(
                    (response) => response.url().includes("/search/tag") && response.request().postDataJSON()?.term === flowConfig.falseActionIdentifier
                );
                await AdminFlowBuilderCreate.tagModalTagsSelectField.fill(flowConfig.falseActionIdentifier);
                ShopAdmin.expects((await tagSearched).ok()).toBeTruthy();
                await ShopAdmin.expects(AdminFlowBuilderCreate.resultList).toBeVisible();
                await AdminFlowBuilderCreate.resultListItem
                    .getByRole("listitem")
                    .filter({ hasText: `${flowConfig.falseActionIdentifier}` })
                    .click();
                //await (await AdminFlowBuilderCreate.getSelectFieldListitem(AdminFlowBuilderCreate.tagModalTagsSelectField, `${flowConfig.falseActionIdentifier}`)).click();
                // The tags select stays open after picking one (it's multi-select); with a long
                // enough result list it can visually overlap and intercept the Add button below.
                await AdminFlowBuilderCreate.tagModalTagsSelectField.press("Escape");
                await AdminFlowBuilderCreate.modalAddButton.click();
                await ShopAdmin.expects(AdminFlowBuilderCreate.falseBlockActionDescription).toContainText(`Tag: ${flowConfig.falseActionIdentifier}`);
                await AdminFlowBuilderCreate.saveButton.click();
                await ShopAdmin.expects(AdminFlowBuilderDetail.successMessage).toBeVisible();
                const flowURL = AdminFlowBuilderDetail.page.url();
                const flowID = flowURL.split("/")[flowURL.split("/").length - 2];
                TestDataService.addCreatedRecord("flow", flowID);
            };
        };
        await use(task);
    },
});
