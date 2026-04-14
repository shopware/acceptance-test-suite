import type { Locator, Page } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class DataSharingConsentModal implements PageObject {
    public readonly page: Page;
    public readonly consentModal: Locator;
    public readonly allowAllButton: Locator;
    public readonly rejectAllButton: Locator;
    public readonly savePreferencesButton: Locator;
    public readonly declineUsageDataButton: Locator;
    public readonly giveConsentUsageDataButton: Locator;
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

        this.consentModal = page.getByRole("dialog").filter({
            has: page.getByRole("heading", {
                name: translate("administration:dataSharing:headlines.consentModal"),
            }),
        });

        this.allowAllButton = this.consentModal.getByRole("button", {
            name: translate("administration:dataSharing:buttons.allowAll"),
        });
        this.rejectAllButton = this.consentModal.getByRole("button", {
            name: translate("administration:dataSharing:buttons.rejectAll"),
        });
        this.savePreferencesButton = this.consentModal.getByRole("button", {
            name: translate("administration:dataSharing:buttons.savePreferences"),
        });
        this.declineUsageDataButton = this.consentModal.getByRole("button", {
            name: translate("administration:dataSharing:buttons.declineUsageData"),
        });
        this.giveConsentUsageDataButton = this.consentModal.getByRole("button", {
            name: translate("administration:dataSharing:buttons.giveConsentUsageData"),
        });

        this.shareStoreDataHeadline = this.consentModal.getByRole("heading", {
            name: translate("administration:dataSharing:headlines.storeData"),
        });
        this.shareStoreDataText = this.consentModal.getByText(translate("administration:dataSharing:messages.storeData"));
        this.shareStoreDataCheckbox = this.consentModal.getByRole("checkbox", {
            name: translate("administration:dataSharing:checkboxes.shareStoreData"),
        });

        this.shareUsageDataHeadline = this.consentModal.getByRole("heading", {
            name: translate("administration:dataSharing:headlines.usageData"),
        });
        this.shareUsageDataText = this.consentModal.getByText(translate("administration:dataSharing:messages.usageData"));
        this.shareUsageDataCheckbox = this.consentModal.getByRole("checkbox", {
            name: translate("administration:dataSharing:checkboxes.shareUsageData"),
        });

        this.storeDataCollectionDetailsLink = this.consentModal.getByRole("link", {
            name: translate("administration:dataSharing:links.storeDataCollectionDetails"),
        });
        this.privacyPolicyLink = this.consentModal.getByRole("link", {
            name: translate("administration:dataSharing:links.privacyPolicy"),
        });
    }

    url() {
        return new Error("Method not implemented, because it is a modal which can not be routed.").message;
    }
}
