import type { Locator, Page } from "playwright-core";
import type { PageObject } from "../../types/PageObject";

export class DataSharingConsentModal implements PageObject {
    public readonly page: Page;
    public readonly consentModal: Locator;
    public readonly allowAllButton: Locator;
    public readonly rejectAllButton: Locator;
    public readonly savePreferencesButton: Locator;
    public readonly shareStoreDataHeadline: Locator;
    public readonly shareStoreDataText: Locator;
    public readonly shareStoreDataCheckbox: Locator;
    public readonly shareUsageDataHeadline: Locator;
    public readonly shareUsageDataText: Locator;
    public readonly shareUsageDataCheckbox: Locator;
    public readonly storeDataCollectionDetailsLink: Locator;
    public readonly privacyPolicyLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.consentModal = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Help us improve Shopware" }) });

        this.allowAllButton = this.consentModal.getByRole("button", { name: "Allow all" });
        this.rejectAllButton = this.consentModal.getByRole("button", { name: "Reject All" });
        this.savePreferencesButton = this.consentModal.getByRole("button", { name: "Save Preferences" });

        this.shareStoreDataHeadline = this.consentModal.getByRole("heading", { name: "Store data" });
        this.shareStoreDataText = this.consentModal.getByText(
            "Anonymous data from your Shopware environment such as orders, diagnostic data, and store data helps us to improve features. You can find an overview of all collected data and details of the agreement here."
        );
        this.shareStoreDataCheckbox = this.consentModal.getByRole("checkbox", { name: "Share store data (anonymous)" });

        this.shareUsageDataHeadline = this.consentModal.getByRole("heading", { name: "Usage data" });
        this.shareUsageDataText = this.consentModal.getByText(
            "We use personal usage data about how you interact with the administration to continously improve usability. You can find all details in our Privacy Policy."
        );
        this.shareUsageDataCheckbox = this.consentModal.getByRole("checkbox", { name: "Share Usage data" });

        this.storeDataCollectionDetailsLink = this.consentModal.getByRole("link", { name: "shopware.com/en/legal/data-use-details" });
        this.privacyPolicyLink = this.consentModal.getByRole("link", { name: "Privacy Policy" });
    }

    url() {
        return new Error("Method not implemented, because it is a modal which can not be routed.").message;
    }
}
