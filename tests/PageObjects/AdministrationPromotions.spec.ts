import { test } from '../../src';

test('Promotions Pages', async ({ 
    ShopAdmin, 
    TestDataService, 
    AdminPromotionsListing,
    
}) => {
    await test.step('Listing page - Empty state.', async () => {
        await ShopAdmin.goesTo(AdminPromotionsListing.url());
        await ShopAdmin.expects(AdminPromotionsListing.smartBarHeader).toBeVisible();
        await ShopAdmin.expects(AdminPromotionsListing.languageSelect).toBeVisible();
        await ShopAdmin.expects(AdminPromotionsListing.smartBarAddPromotionButton).toBeVisible();
        await ShopAdmin.expects(AdminPromotionsListing.emptyState).toBeVisible();
        await ShopAdmin.expects(AdminPromotionsListing.emptyStateAddPromotionButton).toBeVisible();
        await ShopAdmin.expects(AdminPromotionsListing.promotionsTable).not.toBeVisible();
    });

    await test.step('Listing page - With promotions.', async () => {
        const activePromo = await TestDataService.createPromotionWithCode({ active: true });
        const inactivePromo = await TestDataService.createPromotionWithCode({ active: false });

        await ShopAdmin.goesTo(AdminPromotionsListing.url());
        await ShopAdmin.expects(AdminPromotionsListing.promotionsTable).toBeVisible();

        const activeRow = await AdminPromotionsListing.getPromotionRow(activePromo.name);
        const inactiveRow = await AdminPromotionsListing.getPromotionRow(inactivePromo.name);

        await ShopAdmin.expects(activeRow.nameCell).toHaveText(activePromo.name);
        await ShopAdmin.expects(activeRow.activeCell).toBeVisible();
        await ShopAdmin.expects(inactiveRow.nameCell).toHaveText(inactivePromo.name);
        await ShopAdmin.expects(inactiveRow.activeCell).toBeVisible();
    });
}); 