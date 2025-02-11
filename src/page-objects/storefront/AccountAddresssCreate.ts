import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AccountAddressCreate implements PageObject {
    public readonly salutationDropdown: Locator;
    public readonly firstNameInput: Locator;
    public readonly lastNameInput: Locator;
    public readonly companyInput: Locator;
    public readonly departmentInput: Locator;
    public readonly streetInput: Locator;
    public readonly zipcodeInput: Locator;
    public readonly cityInput: Locator;
    public readonly countryDropdown: Locator;
    public readonly saveAddressButton: Locator;
    public readonly stateDropdown: Locator;

    constructor(public readonly page: Page) {
        this.salutationDropdown = page.getByRole('combobox', { name: 'Salutation' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
        this.companyInput = page.getByRole('textbox', { name: 'Company' });
        this.departmentInput = page.getByRole('textbox', { name: 'Department' });
        this.streetInput = page.getByRole('textbox', { name: 'Street' });
        this.zipcodeInput = page.getByRole('textbox', { name: 'Postal code' });
        this.cityInput = page.locator('#addressAddressCity');
        this.countryDropdown = page.locator('#addressAddressCountry');
        this.stateDropdown = page.locator('#addressAddressCountryState');
        this.saveAddressButton = page.locator('.address-form-submit');
    }

    url() {
        return 'account/address/create';
    }
}