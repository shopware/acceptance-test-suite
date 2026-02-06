import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class AccountRecover implements PageObject {
    public readonly passwordRecoveryForm: Locator;
    public readonly title: Locator;
    public readonly subtitle: Locator;
    public readonly emailInput: Locator;
    public readonly requestEmailButton: Locator;
    public readonly backButton: Locator;
    public readonly passwordResetEmailSentMessage: Locator;
    public readonly newPasswordInput: Locator;
    public readonly newPasswordConfirmInput: Locator;
    public readonly changePasswordButton: Locator;
    public readonly invalidLinkMessage: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.passwordRecoveryForm = page.locator(".account-recover-password-form");
        const cardTitle = this.passwordRecoveryForm.locator(".card-title");
        this.title = cardTitle.getByText(translate("storefront:recover:passwordRecovery"));
        this.subtitle = cardTitle.getByText(translate("storefront:recover:subtitle"));
        this.emailInput = this.passwordRecoveryForm.getByLabel(translate("storefront:login:emailAddress"));
        this.requestEmailButton = this.passwordRecoveryForm.getByRole("button", { name: translate("storefront:recover:requestEmail") });
        this.backButton = this.passwordRecoveryForm.getByRole("link", { name: translate("storefront:recover:back") });
        this.passwordResetEmailSentMessage = page.getByText(translate("storefront:recover:emailSent"));
        this.newPasswordInput = page.getByLabel(translate("storefront:recover:newPassword"));
        this.newPasswordConfirmInput = page.getByLabel(translate("storefront:recover:passwordConfirmation"));
        this.changePasswordButton = page.getByRole("button", { name: translate("storefront:recover:changePassword") });
        this.invalidLinkMessage = page.getByText(translate("storefront:recover:invalidLink"));
    }

    url(recoverLink?: string) {
        if (recoverLink) {
            return recoverLink;
        }
        return "account/recover";
    }
}
