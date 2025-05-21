import { test, expect } from '../../src';

test('BaseConfig is set correctly', async ({
    BaseConfig,
    shopware,
    browser,
}) => {
    expect(BaseConfig.shopware.appURL).toMatch(/\/$/);
    expect(BaseConfig.shopware.adminURL).toMatch(/\/$/);
    expect(BaseConfig.shopware.adminAPIURL).toMatch(/\/$/);

    expect(BaseConfig.shopware.appURL).toBe(shopware.appURL);
    expect(BaseConfig.shopware.adminURL).toBe(shopware.adminURL);
    expect(BaseConfig.shopware.adminAPIURL).toBe(shopware.adminAPIURL);

    // check that all URLs work
    const pageContext = await browser.newContext({
        baseURL: BaseConfig.shopware.appURL,
    });
    const page = await pageContext.newPage();
    await page.goto(BaseConfig.shopware.appURL);
    await page.goto(BaseConfig.shopware.adminURL);
    await page.goto(BaseConfig.shopware.adminAPIURL);
});