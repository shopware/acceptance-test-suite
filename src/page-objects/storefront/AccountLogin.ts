import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountLogin implements PageObject {
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly forgotPasswordLink: Locator;
    public readonly loginButton: Locator;
    public readonly logoutLink: Locator;
    public readonly successAlert: Locator;
    public readonly invalidCredentialsAlert: Locator;

    // Inputs for registration
    public readonly personalFormArea: Locator;
    public readonly billingAddressFormArea: Locator;
    public readonly accountTypeSelect: Locator;
    public readonly salutationSelect: Locator;
    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly companyInput: Locator;
    public readonly departmentInput: Locator;
    public readonly vatRegNoInput: Locator;
    public readonly registerEmailInput: Locator;
    public readonly registerPasswordInput: Locator;
    public readonly streetAddressInput: Locator;
    public readonly cityInput: Locator;
    public readonly countryInput: Locator;
    public readonly postalCodeInput: Locator;
    public readonly registerButton: Locator;

    constructor(public readonly page: Page) {
        this.emailInput = page.getByLabel('Your email address');
        this.passwordInput = page.getByLabel('Your password');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'I have forgotten my password.' });
        this.logoutLink = page.getByRole('link', { name: 'Log out'});
        this.invalidCredentialsAlert = page.getByText('Could not find an account that matches the given credentials.');

        this.personalFormArea = page.locator('.register-personal');
        this.billingAddressFormArea = page.locator('.register-billing');
        this.accountTypeSelect = this.personalFormArea.locator('.contact-select');
        this.salutationSelect = this.personalFormArea.locator('.form-group').filter({ has: page.getByLabel('Salutation') }).locator('.form-select');
        this.firstNameInput = this.personalFormArea.getByLabel('First name');
        this.lastNameInput = this.personalFormArea.getByLabel('Last name');
        this.companyInput = this.personalFormArea.getByLabel('Company');
        this.departmentInput = this.personalFormArea.getByLabel('Department');
        this.vatRegNoInput = this.personalFormArea.locator('input[id="vatIds"]');
        this.registerEmailInput = this.personalFormArea.getByLabel('Email address');
        this.registerPasswordInput = this.personalFormArea.getByLabel('Password');
        this.streetAddressInput = this.billingAddressFormArea.getByLabel('Street address');
        this.cityInput = this.billingAddressFormArea.getByLabel('City');
        this.countryInput = this.billingAddressFormArea.getByLabel('Country');
        this.postalCodeInput = this.billingAddressFormArea.getByLabel('Postal code');
        this.registerButton = page.getByRole('button', { name: 'Continue' });
        this.logoutLink = page.getByRole('link', { name: 'Log out'});
        this.successAlert = page.getByText('Successfully logged out.');
    }

    url() {
        return 'account/login';
    }
}