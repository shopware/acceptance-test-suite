import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { satisfies } from "compare-versions";
import { translate } from "../../services/LanguageHelper";

export class CustomerGroupCreate implements PageObject {
    public readonly headline: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly cardTitle: Locator;
    public readonly customerGroupNameField: Locator;
    /**
     * @deprecated Targets the pre-redesign customer group markup, only compatible with shopware v6.6.x and v6.7.x, use 'customerGroupTaxDisplayGross' instead
     */
    public readonly customerGroupGrossTaxDisplay: Locator;
    /**
     * @deprecated Targets the pre-redesign customer group markup, only compatible with shopware v6.6.x and v6.7.x, use 'customerGroupTaxDisplayNet' instead
     */
    public readonly customerGroupNetTaxDisplay: Locator;
    public readonly customerGroupTaxDisplayGross: Locator;
    public readonly customerGroupTaxDisplayNet: Locator;
    public readonly customerGroupPriceBasisGross: Locator;
    public readonly customerGroupPriceBasisNet: Locator;
    public readonly customSignupFormToggle: Locator;
    public readonly signupFormTitle: Locator;
    public readonly signupFormIntroduction: Locator;
    public readonly signupFormSeoDescription: Locator;
    public readonly signupFormCompanySignupToggle: Locator;
    public readonly customerGroupSaleschannelSelection: Locator;
    public readonly customerGroupSaleschannelResultList: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.headline = page.getByRole("heading", { name: translate("administration:customerGroup:create.title") });
        this.saveButton = page.getByRole("button", { name: translate("administration:customerGroup:create.save") });
        this.cancelButton = page.getByRole("button", { name: translate("administration:customerGroup:create.cancel") });
        this.cardTitle = page.getByRole("heading", { name: translate("administration:customerGroup:create.cardTitle") });
        this.customerGroupNameField = page.locator("#sw-field--customerGroup-name");
        this.customerGroupGrossTaxDisplay = page.locator("#sw-field--castedValue-0");
        this.customerGroupNetTaxDisplay = page.locator("#sw-field--castedValue-1");
        this.customerGroupTaxDisplayGross = page.locator("#sw-field--customerGroup-displayGross-0");
        this.customerGroupTaxDisplayNet = page.locator("#sw-field--customerGroup-displayGross-1");
        this.customerGroupPriceBasisGross = page.locator("#sw-field--customerGroup-priceBasis-0");
        this.customerGroupPriceBasisNet = page.locator("#sw-field--customerGroup-priceBasis-1");
        this.customSignupFormToggle = page.getByLabel(translate("administration:customerGroup:create.customSignupForm"));
        this.signupFormTitle = page.locator("#sw-field--customerGroup-registrationTitle");

        if (satisfies(instanceMeta.version, "<6.8")) {
            this.signupFormIntroduction = page.locator(".sw-text-editor__content-editor");
        } else {
            this.signupFormIntroduction = page.locator(".mt-text-editor__content-editor");
        }

        if (satisfies(instanceMeta.version, "<6.7")) {
            this.signupFormSeoDescription = page.locator("#sw-field--customerGroup-registrationSeoMetaDescription");
        } else {
            this.signupFormSeoDescription = page.getByRole("textbox", { name: translate("administration:customerGroup:create.seoMetaDescription") });
        }

        this.signupFormCompanySignupToggle = page.getByLabel(translate("administration:customerGroup:create.companySignupForm"));
        this.customerGroupSaleschannelSelection = page.locator("input[class=sw-select-selection-list__input]");
        this.customerGroupSaleschannelResultList = page.locator(".sw-select-result-list__content");
    }

    url() {
        return "#/sw/settings/customer/group/create";
    }
}
