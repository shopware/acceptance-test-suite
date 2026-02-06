import { test, expect } from "../src";

test(
    "Verify sign-up email",
    { tag: "@Email" },
    async ({ IdProvider, MailpitApiContext, InstanceMeta, TestDataService, ShopCustomer, StorefrontAccountLogin, StorefrontAccount }) => {
        test.skip(InstanceMeta.isSaaS, "Skipping test because it requires a local mailpit instance.");

        // Login with a new customer
        const email = IdProvider.getIdPair().id + "@test.com";
        const password = "shopware";
        await TestDataService.createCustomer({ email: email, password: password });
        await ShopCustomer.goesTo(StorefrontAccountLogin.url());
        await StorefrontAccountLogin.emailInput.fill(email);
        await StorefrontAccountLogin.passwordInput.fill(password);
        await StorefrontAccountLogin.loginButton.click();
        await ShopCustomer.expects(StorefrontAccount.page.getByText(email, { exact: true })).toBeVisible();

        // Create email page
        const emailContent = await MailpitApiContext.generateEmailContent(email);
        const url = "http://email";
        const emailVerificationPage = StorefrontAccount.page;
        await emailVerificationPage.route(url, (route) => {
            route.fulfill({ body: emailContent });
        });

        // Verify email content
        await emailVerificationPage.goto(url);
        await expect(emailVerificationPage.locator("#from")).toContainText("doNotReply@localhost.com");
        await expect(emailVerificationPage.locator("#to")).toContainText(email);
        await expect(emailVerificationPage.locator("#subject")).toContainText("Your sign-up");
        await expect(emailVerificationPage.locator("p").last()).toContainText(email);
    }
);
