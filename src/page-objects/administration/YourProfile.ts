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
    public readonly dataSharingUsageDataHeadline: Locator;
    public readonly dataSharingUsageDataCheckbox: Locator;
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

        this.privacyPreferencesTab = page.locator(".sw-tabs-item").filter({ hasText: "Privacy preferences" });
        this.dataSharingCardTitle = page.getByRole("heading", { name: "Help us to improve Shopware" });
        this.dataSharingUsageDataHeadline = page.getByRole("heading", { name: "Usage data" });
        this.dataSharingUsageDataCheckbox = page.getByRole("checkbox", { name: "Share Usage Data" });
        this.privacyPolicyLink = page.getByRole("link", { name: "Privacy Policy" });
    }

    url(tabName = "general") {
        return `#/sw/profile/index/${tabName}`;
    }
}
