import { getFlowId, test } from "../../src";
import { satisfies } from "compare-versions";

test("Administration page objects - Settings.", async ({
    InstanceMeta,
    AdminApiContext,
    ShopAdmin,
    AdminFirstRunWizard,
    AdminFlowBuilderCreate,
    AdminFlowBuilderListing,
    AdminFlowBuilderDetail,
    AdminDataSharing,
    AdminCustomFieldListing,
    AdminCustomFieldCreate,
    AdminRuleCreate,
    AdminSettingsListing,
    Translate,
}) => {
    await ShopAdmin.goesTo(AdminCustomFieldListing.url());
    await ShopAdmin.expects(AdminCustomFieldListing.addNewSetButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomFieldCreate.url());
    await ShopAdmin.expects(AdminCustomFieldCreate.technicalNameInput).toBeVisible();
    await ShopAdmin.expects(AdminCustomFieldCreate.saveButton).toBeVisible();

    if (!InstanceMeta.isSaaS) {
        if (!InstanceMeta.version.match(/6\.5\.*/)) {
            await ShopAdmin.goesTo(AdminDataSharing.url());
            if (satisfies(InstanceMeta.version, "<6.7.9.0")) {
                await ShopAdmin.expects(AdminDataSharing.dataConsentHeadline!).toBeVisible();
            } else {
                await ShopAdmin.expects(AdminDataSharing.dataSharingCardTitle!).toBeVisible();
            }
        }

        await ShopAdmin.goesTo(AdminFirstRunWizard.url());
        await ShopAdmin.expects(AdminFirstRunWizard.welcomeText).toBeVisible();
        await ShopAdmin.expects(AdminFirstRunWizard.nextButton).toBeVisible({ timeout: 15_000 });

        await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
        await ShopAdmin.expects(AdminFlowBuilderListing.createFlowButton).toBeVisible();
    }

    const flowId = await getFlowId("Order enters status cancelled", AdminApiContext);
    await ShopAdmin.goesTo(AdminFlowBuilderDetail.url(flowId));
    await ShopAdmin.expects(AdminFlowBuilderDetail.saveButton).toBeVisible();

    // todo: fix unsaved changes issue on the previous page so that we don't have to do a hard reload
    await ShopAdmin.goesTo(AdminFlowBuilderCreate.url(), true);
    await ShopAdmin.expects(AdminFlowBuilderCreate.newFlowHeader).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.saveButton).toBeVisible();

    // todo: fix unsaved changes issue on the previous page so that we don't have to do a hard reload
    await ShopAdmin.goesTo(AdminRuleCreate.url(), true);
    await ShopAdmin.expects(AdminRuleCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminRuleCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminSettingsListing.url(), true);
    await ShopAdmin.expects(AdminSettingsListing.header).toContainText(Translate("administration:settings:header.settings"));
    if (satisfies(InstanceMeta.version, ">=6.7.1")) {
        await ShopAdmin.expects(AdminSettingsListing.shopwareServicesLink).toBeVisible();
    }
});
