import type { Page, Locator } from 'playwright-core';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { BaseAccount } from './BaseAccount';
import { translate } from '../../services/LanguageHelper';

export class AccountProfile extends BaseAccount {
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

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page);
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.salutationSelect = page.getByLabel(translate('storefront:account:common.salutation'));
        this.firstNameInput = page.getByLabel(translate('storefront:account:common.firstName'));
        this.lastNameInput = page.getByLabel(translate('storefront:account:common.lastName'));
        this.saveProfileButton = page.locator('#profilePersonalForm').getByRole('button', { name: translate('storefront:account:profile.saveChanges') });

        this.changeEmailButton = page.getByRole('button', { name: translate('storefront:account:profile.changeEmail') });
        this.emailAddressInput = page.locator('input[id="personalMail"]');
        this.emailAddressConfirmInput = page.getByLabel(translate('storefront:account:profile.emailConfirmation'));
        this.emailConfirmPasswordInput = page.locator('input[id="personalMailPasswordCurrent"]');
        this.saveEmailAddressButton = page.locator('#profileMailForm').getByRole('button', { name: translate('storefront:account:profile.saveChanges') });

        this.changePasswordButton = page.getByRole('button', { name: translate('storefront:account:common.changePassword') });
        this.newPasswordInput = page.locator('input[id="newPassword"]');

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.newPasswordConfirmInput = page.locator('input[name="password[newPasswordConfirm]"]');
            this.currentPasswordInput = page.locator('input[name="password[password]"]');
        } else {
            this.newPasswordConfirmInput = page.locator('input[id="passwordConfirmation"]');
            this.currentPasswordInput = page.locator('input[id="password"]');
        }

        this.saveNewPasswordButton = page.locator('#profilePasswordForm').getByRole('button', { name: translate('storefront:account:profile.saveChanges') });
        this.loginDataEmailAddress = page.locator('.account-profile-mail');

        this.emailUpdateMessage = page.getByText(translate('storefront:account:profile.emailUpdated'));
        this.passwordUpdateMessage = page.getByText(translate('storefront:account:common.passwordUpdated'));

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.emailValidationAlert = page.getByText(translate('storefront:account:profile.invalidEmail'));
        } else {
            this.emailValidationAlert = page.locator('.was-validated');
        }

        this.emailUpdateFailureAlert = page.getByText(translate('storefront:account:profile.emailUpdateFailure'));

        if (instanceMeta.features['ACCESSIBILITY_TWEAKS']) {
            this.passwordUpdateFailureAlert = page.getByText(translate('storefront:account:profile.passwordTooShort'));
        } else {
            this.passwordUpdateFailureAlert = page.getByText(translate('storefront:account:profile.passwordUpdateFailure'));
        }
    }

    url() {
        return 'account/profile';
    }
}
