import { test } from '../../src';

test.skip('Promotions Listing - Empty state', async ({
    ShopAdmin, 
    AdminPromotionsListing,
    TestDataService,
    
}) => {
    /* Test is flaky due to parallelization and therefore skipped */
    await TestDataService.clearCaches();
    await ShopAdmin.goesTo(AdminPromotionsListing.url());
    await ShopAdmin.expects(AdminPromotionsListing.smartBarHeader).toBeVisible();
    await ShopAdmin.expects(AdminPromotionsListing.languageSelect).toBeVisible();
    await ShopAdmin.expects(AdminPromotionsListing.smartBarAddPromotionButton).toBeVisible();
    await ShopAdmin.expects(AdminPromotionsListing.emptyState).toBeVisible();
    await ShopAdmin.expects(AdminPromotionsListing.emptyStateAddPromotionButton).toBeVisible();
});

test('Promotions Listing - With promotions', async ({ 
    ShopAdmin, 
    TestDataService, 
    AdminPromotionsListing,
    
}) => {
    const activePromo = await TestDataService.createPromotionWithCode({ active: true });
    const inactivePromo = await TestDataService.createPromotionWithCode({ active: false });
    await ShopAdmin.goesTo(AdminPromotionsListing.url());
    await ShopAdmin.expects(AdminPromotionsListing.promotionsTable).toBeVisible();

    const activeRow = await AdminPromotionsListing.getPromotionRow(activePromo.name);
    const inactiveRow = await AdminPromotionsListing.getPromotionRow(inactivePromo.name);
    await ShopAdmin.expects(activeRow.promotionName).toHaveText(activePromo.name);
    await ShopAdmin.expects(activeRow.promotionActive).toBeVisible();
    await ShopAdmin.expects(activeRow.promotionValidFrom).toBeVisible();
    await ShopAdmin.expects(activeRow.promotionValidUntil).toBeVisible();
    await ShopAdmin.expects(activeRow.promotionContextButton).toBeVisible();
    
    await activeRow.promotionContextButton.click();
    await ShopAdmin.expects(activeRow.promotionContextMenuEditButton).toBeVisible();
    await ShopAdmin.expects(activeRow.promotionContextMenuDuplicateButton).toBeVisible();
    await ShopAdmin.expects(activeRow.promotionContextMenuDeleteButton).toBeVisible();

    await ShopAdmin.expects(inactiveRow.promotionName).toHaveText(inactivePromo.name);
    await ShopAdmin.expects(inactiveRow.promotionInactive).toBeVisible();
});

test('Promotions Listing - Create page', async ({ 
    ShopAdmin, 
    AdminPromotionCreate,
    
}) => {
    await ShopAdmin.goesTo(AdminPromotionCreate.url());
    await ShopAdmin.expects(AdminPromotionCreate.smartBarHeader).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.languageSelect).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.saveButton).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.cancelButton).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.generalCard).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.nameInput).toBeVisible();
    await ShopAdmin.expects(AdminPromotionCreate.priorityInput).toBeVisible();
});

test('Promotions - Detail page', async ({ 
    ShopAdmin, 
    TestDataService, 
    AdminPromotionDetail,
    
}) => {
    const activePromo = await TestDataService.createPromotionWithCode({ active: true });
    await ShopAdmin.goesTo(AdminPromotionDetail.url(activePromo.id));
    await ShopAdmin.expects(AdminPromotionDetail.tabGeneralLink).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.tabConditionsLink).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.tabDiscountsLink).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.promotionCodesCard).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.promotionCodesHeading).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.promotionCodesSelection).toBeVisible();

    await ShopAdmin.goesTo(AdminPromotionDetail.url(activePromo.id, 'conditions'));
    await ShopAdmin.expects(AdminPromotionDetail.preConditionsCard).toBeVisible();
    
    await ShopAdmin.goesTo(AdminPromotionDetail.url(activePromo.id, 'discounts'));
    await ShopAdmin.expects(AdminPromotionDetail.addDiscountButton).toBeVisible();
    await ShopAdmin.expects(AdminPromotionDetail.discountCards).toBeVisible();
});