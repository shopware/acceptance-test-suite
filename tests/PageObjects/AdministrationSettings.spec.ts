import { getFlowId, isSaaSInstance, test } from '../../src';

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

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!await isSaaSInstance(AdminApiContext)) {
        await ShopAdmin.goesTo(AdminFirstRunWizard.url());
        await ShopAdmin.expects(AdminFirstRunWizard.nextButton).toBeVisible();
    }

    await ShopAdmin.goesTo(AdminCustomerGroupListing.url());
    await ShopAdmin.expects(AdminCustomerGroupListing.addCustomerGroupButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupCreate.url());
    await ShopAdmin.expects(AdminCustomerGroupCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomerGroupDetail.url(DefaultSalesChannel.salesChannel.customerGroupId));
    await ShopAdmin.expects(AdminCustomerGroupDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminFlowBuilderCreate.url());
    await ShopAdmin.expects(AdminFlowBuilderCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminFlowBuilderListing.url());
    await ShopAdmin.expects(AdminFlowBuilderListing.createFlowButton).toBeVisible();

    const flowId = await getFlowId('Order enters status unconfirmed', AdminApiContext);
    await ShopAdmin.goesTo(AdminFlowBuilderDetail.url(flowId));
    await ShopAdmin.expects(AdminFlowBuilderDetail.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomFieldListing.url());
    await ShopAdmin.expects(AdminCustomFieldListing.addNewSetButton).toBeVisible();

    await ShopAdmin.goesTo(AdminCustomFieldCreate.url());
    await ShopAdmin.expects(AdminCustomFieldCreate.saveButton).toBeVisible();

    await ShopAdmin.goesTo(AdminRuleCreate.url());
    await ShopAdmin.expects(AdminRuleCreate.saveButton).toBeVisible();

    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!InstanceMeta.isSaaS) {

        // eslint-disable-next-line playwright/no-conditional-in-test
        if (!InstanceMeta.version.match(/6\.5\.*/)) {
            await ShopAdmin.goesTo(AdminDataSharing.url());
            await ShopAdmin.expects(AdminDataSharing.dataConsentHeadline).toBeVisible();
        }
    }
});