import { getFlowId, test } from '../../src';

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
}) => {
    await ShopAdmin.goesTo(AdminCustomerGroupListing.url());
    await ShopAdmin.expects(AdminCustomerGroupListing.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupListing.addCustomerGroupButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupCreate.url());
    await ShopAdmin.expects(AdminCustomerGroupCreate.cardTitle).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupDetail.url(DefaultSalesChannel.salesChannel.customerGroupId));
    await ShopAdmin.expects(AdminCustomerGroupDetail.headline).toBeVisible();
    await ShopAdmin.expects(AdminCustomerGroupDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminFlowBuilderCreate.url());
    await ShopAdmin.expects(AdminFlowBuilderCreate.header).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminRuleCreate.url());
    await ShopAdmin.expects(AdminRuleCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminRuleCreate.saveButton).toBeVisible();

    const flowId = await getFlowId('Order enters status unconfirmed', AdminApiContext);
    await ShopAdmin.goesTo(AdminFlowBuilderDetail.url(flowId));
    await ShopAdmin.expects(AdminFlowBuilderDetail.generalTab).toBeVisible();
    await ShopAdmin.expects(AdminFlowBuilderDetail.saveButton).toBeVisible();

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
});