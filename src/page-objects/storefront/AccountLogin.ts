import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class AccountLogin implements PageObject {
    public readonly emailInput: Locator;
    public readonly passwordInput: Locator;
    public readonly forgotPasswordLink: Locator;
    public readonly loginButton: Locator;
    public readonly logoutLink: Locator;
    public readonly successAlert: Locator;
    public readonly invalidCredentialsAlert: Locator;
    public readonly passwordUpdatedAlert: Locator;

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

    // Inputs for reCaptcha
    public readonly greCaptchaV2Container: Locator;
    public readonly greCaptchaV2Input: Locator;
    public readonly greCaptchaV3Input: Locator;
    public readonly greCaptchaProtectionInformation: Locator;
    public readonly greCaptchaBadge: Locator;

    //Input for shipping address
    public readonly differentShippingAddressCheckbox: Locator;
    public readonly registerShippingAddressFormArea: Locator;
    public readonly shippingAddressSalutationSelect: Locator;
    public readonly shippingAddressFirstNameInput: Locator;
    public readonly shippingAddressLastNameInput: Locator;
    public readonly shippingAddressStreetAddressInput: Locator;
    public readonly shippingAddressCityInput: Locator;
    public readonly shippingAddressCountryInput: Locator;
    public readonly shippingAddressPostalCodeInput: Locator;
    public readonly shippingAddressStateInput: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByLabel(translate("storefront:login:emailAddress"));
        this.passwordInput = page.getByLabel(translate("storefront:login:password"));
        this.loginButton = page.getByRole("button", { name: translate("storefront:login:loginButton") });
        this.forgotPasswordLink = page.getByRole("link", { name: translate("storefront:login:forgotPassword") });
        this.logoutLink = page.getByRole("link", { name: translate("storefront:login:logout") });
        this.invalidCredentialsAlert = page.getByText(translate("storefront:login:invalidCredentials"));

        this.personalFormArea = page.locator(".register-personal");
        this.billingAddressFormArea = page.locator(".register-billing");
        this.accountTypeSelect = this.personalFormArea.locator(".contact-select");
        this.salutationSelect = this.personalFormArea
            .locator(".form-group")
            .filter({ has: page.getByLabel(translate("storefront:login:register.salutation")) })
            .locator(".form-select");
        this.firstNameInput = this.personalFormArea.getByLabel(translate("storefront:login:register.firstName"));
        this.lastNameInput = this.personalFormArea.getByLabel(translate("storefront:login:register.lastName"));
        this.companyInput = this.personalFormArea.getByLabel(translate("storefront:login:register.company"));
        this.departmentInput = this.personalFormArea.getByLabel(translate("storefront:login:register.department"));
        this.vatRegNoInput = this.personalFormArea.locator('input[id="vatIds"]');
        this.registerEmailInput = this.personalFormArea.getByLabel(translate("storefront:login:register.emailAddress"));
        this.registerPasswordInput = this.personalFormArea.getByLabel(translate("storefront:login:register.password"));
        this.streetAddressInput = this.billingAddressFormArea.getByLabel(translate("storefront:login:register.streetAddress"));
        this.cityInput = this.billingAddressFormArea.getByLabel(translate("storefront:login:register.city"));
        this.countryInput = this.billingAddressFormArea.getByLabel(translate("storefront:login:register.country"));
        this.postalCodeInput = this.billingAddressFormArea.getByLabel(translate("storefront:login:register.postalCode"));
        this.differentShippingAddressCheckbox = page.getByRole("checkbox", { name: translate("storefront:login:register.differentShippingAddress") });
        this.registerShippingAddressFormArea = page.locator(".register-shipping");
        this.shippingAddressSalutationSelect = this.registerShippingAddressFormArea
            .locator(".form-group")
            .filter({ has: page.getByLabel(translate("storefront:login:register.salutation")) })
            .locator(".form-select");
        this.shippingAddressFirstNameInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.firstName"));
        this.shippingAddressLastNameInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.lastName"));
        this.shippingAddressStreetAddressInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.streetAddress"));
        this.shippingAddressCityInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.city"));
        this.shippingAddressCountryInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.country"));
        this.shippingAddressPostalCodeInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.postalCode"));
        this.shippingAddressStateInput = this.registerShippingAddressFormArea.getByLabel(translate("storefront:login:register.state"));
        this.registerButton = page.getByRole("button", { name: translate("storefront:login:register.continue") });
        this.logoutLink = page.getByRole("link", { name: translate("storefront:login:logout") });
        this.successAlert = page.getByText(translate("storefront:login:successfulLogout"));
        this.passwordUpdatedAlert = page.getByText(translate("storefront:login:passwordUpdated"));

        this.greCaptchaV2Container = this.page.locator(".grecaptcha-v2-container");
        this.greCaptchaV2Input = this.page.locator(".grecaptcha-v2-input");
        this.greCaptchaV3Input = this.page.locator(".grecaptcha_v3-input");
        this.greCaptchaProtectionInformation = this.page.locator(".grecaptcha-protection-information");
        this.greCaptchaBadge = this.page.locator(".grecaptcha-badge");
    }

    async getShippingCountryLocatorByName(countryName: string): Promise<Locator> {
        return this.shippingAddressCountryInput.locator("option").filter({ hasText: countryName });
    }

    url() {
        return "account/login";
    }
}
