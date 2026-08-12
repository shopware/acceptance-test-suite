import { test, expect } from "../src/index";

test("Theme compilation.", async ({ StorefrontPage }) => {
    const allCSSResponsePromise = StorefrontPage.waitForResponse(/all\.css/);
    const storefrontJavaScriptResponsePromise = StorefrontPage.waitForResponse(/\/js\/storefront\/storefront\.js/);

    await StorefrontPage.reload();

    const [allCssResponse, storefrontJavaScriptResponse] = await Promise.all([
        allCSSResponsePromise,
        storefrontJavaScriptResponsePromise,
    ]);

    expect(allCssResponse.status()).toBeLessThan(400);
    expect(storefrontJavaScriptResponse.status()).toBeLessThan(400);
});
