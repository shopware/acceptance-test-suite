import { test, expect } from '../src/index';

test('Verify sign-up email', { tag: '@Email' }, async ({
    ShopCustomer,
    StorefrontAccountLogin,
    StorefrontAccount, IdProvider,
    page,
    MailpitApiContext,
    TestDataService,
}) => {
    // Login with a new customer
    const email = IdProvider.getIdPair().id + '@test.com';
    const password = 'shopware';
    await TestDataService.createCustomer({ email: email, password: password });
    await ShopCustomer.goesTo(StorefrontAccountLogin.url());
    await StorefrontAccountLogin.emailInput.fill(email);
    await StorefrontAccountLogin.passwordInput.fill(password);
    await StorefrontAccountLogin.loginButton.click();
    await ShopCustomer.expects(StorefrontAccount.page.getByText(email, { exact: true })).toBeVisible();

    // Create email page
    const emailContent = await MailpitApiContext.generateEmailContent(email);
    const url = 'http://email';
    await page.route(url, route => {
        route.fulfill({ body: emailContent })
    })

    // Verify email content
    await page.goto(url);
    await expect(page.locator('#from')).toContainText('doNotReply@localhost.com');
    await expect(page.locator('#to')).toContainText(email);
    await expect(page.locator('#subject')).toContainText('Your sign-up');
    await expect(page.locator('p').last()).toContainText(email);

});