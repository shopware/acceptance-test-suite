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

    constructor(public readonly page: Page) {
        this.salutationDropdown = page.locator('#addresspersonalSalutation');
        this.firstNameInput = page.locator('#addresspersonalFirstName');
        this.lastNameInput = page.locator('#addresspersonalLastName');
        this.companyInput = page.locator('#addresscompany');
        this.departmentInput = page.locator('#addressdepartment');
        this.streetInput = page.locator('#addressAddressStreet');
        this.zipcodeInput = page.locator('#addressAddressZipcode');
        this.cityInput = page.locator('#addressAddressCity');
        this.countryDropdown = page.locator('#addressAddressCountry');
        this.saveAddressButton = page.locator('.address-form-submit');
    }

    url() {
        return 'account/address/create';
    }
}