import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class AccountProfile implements PageObject {
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];
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
    public readonly loginDataEmailAddress: Locator;

    public readonly emailUpdateMessage: Locator;
    public readonly passwordUpdateMessage: Locator;
    public readonly emailValidationAlert: Locator;
    public readonly emailUpdateFailureAlert: Locator;
    public readonly passwordUpdateFailureAlert: Locator;

    constructor(
        page: Page,
        instanceMeta: HelperFixtureTypes['InstanceMeta']
    ) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.salutationSelect = page.getByLabel('Salutation');
        this.firstNameInput = page.getByLabel('First name');
        this.lastNameInput = page.getByLabel('Last name');
        this.saveProfileButton = page.locator('#profilePersonalForm').getByRole('button', { name: 'Save changes' })

        this.changeEmailButton = page.getByRole('button', { name: 'Change email address' });
        this.emailAddressInput = page.locator('input[id="personalMail"]');
        this.emailAddressConfirmInput = page.getByLabel('Email address confirmation');
        this.emailConfirmPasswordInput = page.locator('input[id="personalMailPasswordCurrent"]');
        this.saveEmailAddressButton = page.locator('#profileMailForm').getByRole('button', { name: 'Save changes' });

        this.changePasswordButton = page.getByRole('button', { name: 'Change password' });
        this.newPasswordInput = page.locator('input[id="newPassword"]');

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.newPasswordConfirmInput = page.locator('input[name="password[newPasswordConfirm]"]');
            this.currentPasswordInput = page.locator('input[name="password[password]"]');
        } else {
            this.newPasswordConfirmInput = page.locator('input[id="passwordConfirmation"]');
            this.currentPasswordInput = page.locator('input[id="password"]');
        }

        this.saveNewPasswordButton = page.locator('#profilePasswordForm').getByRole('button', { name: 'Save changes' });
        this.loginDataEmailAddress = page.locator('.account-profile-mail');

        this.emailUpdateMessage = page.getByText('Your email address has been updated.');
        this.passwordUpdateMessage = page.getByText('Your password has been updated.');

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.emailValidationAlert = page.getByText('Invalid email address.');
        } else {
            this.emailValidationAlert = page.locator('.was-validated');
        }

        this.emailUpdateFailureAlert = page.getByText('Email address could not be changed.');

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.passwordUpdateFailureAlert = page.getByText('Input is too short.');
        } else {
            this.passwordUpdateFailureAlert = page.getByText('Password could not be changed.');
        }
    }

    url() {
        return 'account/profile';
    }
}