import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountProfile implements PageObject {
    public readonly salutationSelect: Locator;
    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly saveProfileButton: Locator;

    public readonly changeEmailButton: Locator;
    public readonly emailAddressInput: Locator;
    public readonly emailAddressConfirmInput: Locator;
    public readonly emailConfirmPasswordInput: Locator;
    public readonly saveEmailAddressButton: Locator;

    public readonly changePasswordButton: Locator;
    public readonly newPasswordInput: Locator;
    public readonly newPasswordConfirmInput: Locator;
    public readonly currentPasswordInput: Locator;
    public readonly saveNewPasswordButton: Locator;

    constructor(public readonly page: Page) {
        this.salutationSelect = page.getByLabel('Salutation');
        this.firstNameInput = page.getByPlaceholder('Enter first name...');
        this.lastNameInput = page.getByPlaceholder('Enter last name...');
        this.saveProfileButton = page.locator('#profilePersonalForm').getByRole('button', { name: 'Save changes' })

        this.changeEmailButton = page.getByRole('button', { name: 'Change email address' });
        this.emailAddressInput = page.getByPlaceholder('Enter email address...');
        this.emailAddressConfirmInput = page.getByPlaceholder('Enter your email address once again...');
        this.emailConfirmPasswordInput = page.getByPlaceholder('Enter password...');
        this.saveEmailAddressButton = page.locator('#profileMailForm').getByRole('button', { name: 'Save changes' });

        this.changePasswordButton = page.getByRole('button', { name: 'Change password' });
        this.newPasswordInput = page.getByPlaceholder('Enter new password...');
        this.newPasswordConfirmInput = page.getByPlaceholder('Enter your new password once again...');
        this.currentPasswordInput = page.getByPlaceholder('Enter current password...');
        this.saveNewPasswordButton = page.locator('#profilePasswordForm').getByRole('button', { name: 'Save changes' });
    }

    url() {
        return 'account/profile';
    }
}