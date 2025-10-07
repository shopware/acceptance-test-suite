import { getFlowId, test } from '../../src';
import { satisfies } from 'compare-versions';

test('Administration page objects - Settings.', async ({
    InstanceMeta,
    AdminApiContext,
    ShopAdmin,
    DefaultSalesChannel,
    AdminCustomerGroupListing,
    AdminCustomerGroupCreate,
    AdminCustomerGroupDetail,
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
    await ShopAdmin.goesTo(AdminCustomerGroupListing.url());
    await ShopAdmin.expects(AdminCustomerGroupListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupListing.addCustomerGroupButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupCreate.url());
    await ShopAdmin.expects(AdminCustomerGroupCreate.customerGroupNameField).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupDetail.url(DefaultSalesChannel.salesChannel.customerGroupId));
    await ShopAdmin.expects(AdminCustomerGroupDetail.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomFieldListing.url());
    await ShopAdmin.expects(AdminCustomFieldListing.addNewSetButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomFieldCreate.url());
    await ShopAdmin.expects(AdminCustomFieldCreate.technicalNameInput).toBeVisible();
    await ShopAdmin.expects(AdminCustomFieldCreate.saveButton).toBeVisible();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!InstanceMeta.isSaaS) {
        // eslint-disable-next-line playwright/no-conditional-in-test
        if (!InstanceMeta.version.match(/6\.5\.*/)) {
            await ShopAdmin.goesTo(AdminDataSharing.url());
            await ShopAdmin.expects(AdminDataSharing.dataConsentHeadline).toBeVisible();
        }

        await ShopAdmin.goesTo(AdminFirstRunWizard.url());
        await ShopAdmin.expects(AdminFirstRunWizard.welcomeText).toBeVisible();
        await ShopAdmin.expects(AdminFirstRunWizard.nextButton).toBeVisible({ timeout: 15_000 });

        await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
        await ShopAdmin.expects(AdminFlowBuilderListing.createFlowButton).toBeVisible();
    }

    const flowId = await getFlowId('Order enters status unconfirmed', AdminApiContext);
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
    await ShopAdmin.expects(AdminSettingsListing.header).toContainText(Translate('administration:settings:header.settings'));
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (satisfies(InstanceMeta.version, '>=6.7.1')) {
        await ShopAdmin.expects(AdminSettingsListing.shopwareServicesLink).toBeVisible();
    }
});
