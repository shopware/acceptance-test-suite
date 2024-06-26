import { test, expect } from '../src/index';

test('Theme compilation.', async ({
    StorefrontPage,
}) => {
    const allCSSResponsePromise = StorefrontPage.waitForResponse(/all\.css/);
    await StorefrontPage.reload();
    const response = await allCSSResponsePromise;
    await expect(response.status()).toBeLessThan(400);
});
