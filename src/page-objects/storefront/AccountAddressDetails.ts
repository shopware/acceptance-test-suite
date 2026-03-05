import type { Page, Locator } from "playwright-core";
import { BaseAccount } from "./BaseAccount";
import { translate } from "../../services/LanguageHelper";

export class AccountAddressDetails extends BaseAccount {
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

    constructor(page: Page) {
        super(page);
        this.salutationDropdown = page.getByRole("combobox", { name: translate("storefront:address:common.salutation") });
        this.firstNameInput = page.getByRole("textbox", { name: translate("storefront:address:common.firstName") });
        this.lastNameInput = page.getByRole("textbox", { name: translate("storefront:address:common.lastName") });
        this.companyInput = page.getByRole("textbox", { name: translate("storefront:address:common.company") });
        this.departmentInput = page.getByRole("textbox", { name: translate("storefront:address:common.department") });
        this.streetInput = page.getByRole("textbox", { name: translate("storefront:address:common.street") });
        this.zipcodeInput = page.getByRole("textbox", { name: translate("storefront:address:common.postalCode") });
        this.cityInput = page.locator("#addressAddressCity");
        this.countryDropdown = page.locator("#addressAddressCountry");
        this.stateDropdown = page.locator("#addressAddressCountryState");
        this.saveAddressButton = page.locator(".address-form-submit");
    }

    /**
    * The address details page is used for both creating and editing addresses. The URL contains the address ID when editing an existing address, but not when creating a new one. Therefore, the addressId parameter is optional.
    * @param addressId - The ID of the address being edited. This parameter is optional because the same page object is used for creating new addresses, where no address ID is present in the URL.
    */
    url(addressId: string = '')  {
        if (addressId) {
            return `account/address/${addressId}`;
        }
        return "account/address/create";
    }
}