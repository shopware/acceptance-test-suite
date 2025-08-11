import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

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

    constructor(public readonly page: Page) {
        this.passwordRecoveryForm = page.locator('.account-recover-password-form');
        const cardTitle = this.passwordRecoveryForm.locator('.card-title');
        this.title = cardTitle.getByText('Password recovery');
        this.subtitle = cardTitle.getByText('We will send you a confirmation email. Click the link in that email in order to change your password.');
        this.emailInput = this.passwordRecoveryForm.getByLabel('Your email address');
        this.requestEmailButton = this.passwordRecoveryForm.getByRole('button', { name: 'Request email' });
        this.backButton = this.passwordRecoveryForm.getByRole('link', { name: 'Back' });
        this.passwordResetEmailSentMessage = page.getByText('If the provided email address is registered, a confirmation email including a password reset link has been sent.');
        this.newPasswordInput = page.getByLabel('New password');
        this.newPasswordConfirmInput = page.getByLabel('Password confirmation');
        this.changePasswordButton = page.getByRole('button', { name: 'Change password' });
        this.invalidLinkMessage = page.getByText('The password reset link seems to be invalid.');
    }

    url(recoverLink?: string) {
        if (recoverLink) {
            return recoverLink;
        }
        return 'account/recover';
    }
}
