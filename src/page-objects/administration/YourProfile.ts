import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class YourProfile implements PageObject {
    public readonly contentView: Locator;
    public readonly page: Page;
    public readonly searchPreferencesTab: Locator;
    public readonly firstNameField: Locator;
    public readonly lastNameField: Locator;
    public readonly userNameField: Locator;
    public readonly emailField: Locator;
    public readonly deselectAllButton: Locator;

    public readonly privacyPreferencesTab: Locator;
    public readonly dataSharingCardTitle: Locator;
    public readonly dataSharingMyDataHeadline: Locator;
    public readonly dataSharingMyDataCheckbox: Locator;
    public readonly dataUseDetailsLink: Locator;
    public readonly privacyPolicyLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator(".sw-desktop__content");
        this.searchPreferencesTab = page.locator(".sw-tabs-item").filter({ hasText: translate("administration:yourProfile:tabs.searchPreferences") });
        this.firstNameField = page.getByRole("textbox", { name: translate("administration:yourProfile:fields.firstName") });
        this.lastNameField = page.getByRole("textbox", { name: translate("administration:yourProfile:fields.lastName") });
        this.userNameField = page.getByRole("textbox", { name: translate("administration:yourProfile:fields.username") });
        this.emailField = page.getByRole("textbox", { name: translate("administration:yourProfile:fields.email") });
        this.deselectAllButton = page.getByRole("button", { name: translate("administration:yourProfile:buttons.deselectAll") });

        this.privacyPreferencesTab = page.locator(".sw-tabs-item").filter({ hasText: "Privacy Preferences" });
        this.dataSharingCardTitle = page.getByRole("heading", { name: "Help us improve" });
        this.dataSharingMyDataHeadline = page.getByRole("heading", { name: "My data" });
        this.dataSharingMyDataCheckbox = page.getByRole("checkbox", { name: "Share my data" });
        this.dataUseDetailsLink = page.getByRole("link", { name: "Privacy Policy" });
        this.privacyPolicyLink = page.getByRole("link", { name: "shopware.com/en/data-use-details" });
    }


    url(tabName = "general") {
        return `#/sw/profile/index/${tabName}`;
    }
}
