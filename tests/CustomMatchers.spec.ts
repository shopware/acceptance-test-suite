import { test } from '../src';

test('Check for visible focus', async ({ ShopCustomer, StorefrontHome, StorefrontHeader }) => {

    await ShopCustomer.goesTo(StorefrontHome.url());
    await ShopCustomer.expects(StorefrontHome.categoryTitle).toBeVisible();

    await test.step('Detect outline', async () => {
        await StorefrontHome.page.keyboard.press('Tab');
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeVisible();
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeFocused();
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveCSS('outline', 'rgb(0, 95, 204) auto 1px');
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveVisibleFocus();
    });

    await test.step('Detect box-shadow', async () => {
        await StorefrontHeader.searchInput.focus();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toBeFocused();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveCSS('box-shadow', 'rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 66, 160) 0px 0px 0px 4px');
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveVisibleFocus();
    });
});