import { test } from "../src";

test("Check for visible focus", async ({ ShopCustomer, StorefrontHome, StorefrontHeader }) => {
    await ShopCustomer.goesTo(StorefrontHome.url());

    await test.step("Detect outline", async () => {
        await StorefrontHome.page.keyboard.press("Tab");
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeVisible();
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toBeFocused();

        //We use regexes to simply check a valid outline/box-shadow exists as styling will naturally vary.
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveCSS("outline", /(.|\s)*\S(.|\s)*/);
        await ShopCustomer.expects(StorefrontHeader.skipToMainContentLink).toHaveVisibleFocus();
    });

    await test.step("Detect box-shadow", async () => {
        await StorefrontHeader.searchInput.focus();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toBeFocused();
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveCSS("box-shadow", /(.|\s)*\S(.|\s)*/);
        await ShopCustomer.expects(StorefrontHeader.searchInput).toHaveVisibleFocus();
    });
});
