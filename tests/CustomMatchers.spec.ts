import { test } from '../src';

test('Check for visible focus', async ({ ShopCustomer, StorefrontHome, StorefrontHeader }) => {

    await ShopCustomer.goesTo(StorefrontHome.url());
    await StorefrontHome.categoryTitle.waitFor({ state: 'visible' });

    await test.step('Detect outline', async () => {
        await StorefrontHome.page.keyboard.press('Tab');
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeVisible();
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeFocused();
        /**
         * Skip links use -webkit-focus-ring-color for :visible-focus which displays a different color based on OS and browser settings.
         *     Therefore we use a regex to simply check that a valid outline exists rather than a specific color.
         */
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveCSS('outline', /(.|\s)*\S(.|\s)*/);
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveVisibleFocus();
    });

    await test.step('Detect box-shadow', async () => {
        await StorefrontHeader.searchInput.focus();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toBeFocused();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveCSS('box-shadow', 'rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 66, 160) 0px 0px 0px 4px');
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveVisibleFocus();
    });
});