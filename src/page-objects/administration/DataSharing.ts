import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";
import { satisfies } from "compare-versions";

export class DataSharing implements PageObject {
    public readonly dataConsentHeadline: Locator | undefined;

    public readonly dataSharingSuccessMessageLabel: Locator | undefined;
    public readonly dataSharingAgreeButton: Locator | undefined;
    public readonly dataSharingDisableButton: Locator | undefined;
    public readonly dataSharingTermsAgreementLabel: Locator | undefined;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    public readonly dataSharingCardTitle: Locator | undefined;
    public readonly dataSharingStoreDataHeadline: Locator | undefined;
    public readonly dataSharingStoreDataCheckbox: Locator | undefined;
    public readonly dataUseDetailsLink: Locator | undefined;

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;

        if (satisfies(instanceMeta.version, "<6.7.9.0")) {
            if (satisfies(instanceMeta.version, "<6.6.1")) {
                this.dataConsentHeadline = page.locator("header.sw-usage-data-consent-banner__title");
            } else {
                this.dataConsentHeadline = page.locator("h3.sw-usage-data-consent-banner__content-headline");
            }

            this.dataSharingAgreeButton = page.getByRole("button", { name: translate("administration:dataSharing:buttons.agree") });
            this.dataSharingDisableButton = page.getByRole("button", { name: translate("administration:dataSharing:buttons.disableDataSharing") });
            this.dataSharingSuccessMessageLabel = page.getByText(translate("administration:dataSharing:messages.sharingData"), { exact: true });
            this.dataSharingTermsAgreementLabel = page.getByText(translate("administration:dataSharing:messages.termsAgreement"));
        } else {
            this.dataSharingCardTitle = page.getByRole("heading", { name: translate("administration:dataSharing:headlines.consentModal") });
            this.dataSharingStoreDataHeadline = page.getByRole("heading", { name: translate("administration:dataSharing:headlines.storeData") });
            this.dataSharingStoreDataCheckbox = page.getByRole("checkbox", { name: translate("administration:dataSharing:checkboxes.shareStoreData") });

            this.dataUseDetailsLink = page.getByRole("link", { name: translate("administration:dataSharing:links.storeDataCollectionDetails") });
        }
    }

    url() {
        if (satisfies(this.instanceMeta.version, "<6.6.1")) {
            return "#/sw/settings/usage/data/index";
        }

        return "#/sw/settings/usage/data/index/general";
    }
}
