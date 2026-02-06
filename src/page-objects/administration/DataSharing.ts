import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";
import { satisfies } from "compare-versions";

export class DataSharing implements PageObject {
    public readonly dataConsentHeadline: Locator;

    public readonly dataSharingSuccessMessageLabel: Locator;
    public readonly dataSharingAgreeButton: Locator;
    public readonly dataSharingDisableButton: Locator;
    public readonly dataSharingTermsAgreementLabel: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        if (satisfies(instanceMeta.version, "<6.6.1")) {
            this.dataConsentHeadline = page.locator("header.sw-usage-data-consent-banner__title");
        } else {
            this.dataConsentHeadline = page.locator("h3.sw-usage-data-consent-banner__content-headline");
        }

        this.dataSharingAgreeButton = page.getByRole("button", { name: translate("administration:dataSharing:buttons.agree") });
        this.dataSharingDisableButton = page.getByRole("button", { name: translate("administration:dataSharing:buttons.disableDataSharing") });
        this.dataSharingSuccessMessageLabel = page.getByText(translate("administration:dataSharing:messages.sharingData"), { exact: true });
        this.dataSharingTermsAgreementLabel = page.getByText(translate("administration:dataSharing:messages.termsAgreement"));
    }

    url() {
        if (satisfies(this.instanceMeta.version, "<6.6.1")) {
            return "#/sw/settings/usage/data/index";
        }

        return "#/sw/settings/usage/data/index/general";
    }
}
