import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

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

    //Account menu
    public readonly overviewLink: Locator;
    public readonly yourProfileLink: Locator;
    public readonly addressesLink: Locator;
    public readonly ordersLink: Locator;
    public readonly subscriptionsLink: Locator;
    public readonly logoutLink: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.salutationDropdown = page.getByRole('combobox', { name: translate('storefront:address:common.salutation') });
        this.firstNameInput = page.getByRole('textbox', { name: translate('storefront:address:common.firstName') });
        this.lastNameInput = page.getByRole('textbox', { name: translate('storefront:address:common.lastName') });
        this.companyInput = page.getByRole('textbox', { name: translate('storefront:address:common.company') });
        this.departmentInput = page.getByRole('textbox', { name: translate('storefront:address:common.department') });
        this.streetInput = page.getByRole('textbox', { name: translate('storefront:address:common.street') });
        this.zipcodeInput = page.getByRole('textbox', { name: translate('storefront:address:common.postalCode') });
        this.cityInput = page.locator('#addressAddressCity');
        this.countryDropdown = page.locator('#addressAddressCountry');
        this.stateDropdown = page.locator('#addressAddressCountryState');
        this.saveAddressButton = page.locator('.address-form-submit');

        //Account menu
        this.overviewLink = page.getByRole('link', { name: 'Overview' });
        this.yourProfileLink = page.getByRole('link', { name: 'Your profile' });
        this.addressesLink = page.getByRole('link', { name: 'Addresses' });
        this.ordersLink = page.getByRole('link', { name: 'Orders' });
        this.subscriptionsLink = page.getByRole('link', { name: 'Subscriptions' });
        this.logoutLink = page.getByRole('link', { name: 'Log out' });
    }

    url() {
        return 'account/address/create';
    }
}
