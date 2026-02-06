import type { Page, Locator } from "playwright-core";
import { ManufacturerCreate } from "./ManufacturerCreate";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { satisfies } from "compare-versions";
import { translate } from "../../services/LanguageHelper";

export class ManufacturerDetail extends ManufacturerCreate {
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        super(page, instanceMeta);

        if (satisfies(instanceMeta.version, "<6.7")) {
            this.customFieldCard = page.locator(".sw-card").getByText(translate("administration:manufacturer:detail.customFields"));
        } else {
            this.customFieldCard = page.locator(".mt-card").getByText(translate("administration:manufacturer:detail.customFields"));
        }

        this.customFieldSetTabs = this.customFieldCard.locator(".sw-tabs-item");
        this.customFieldSetTabCustomContent = this.customFieldCard.locator(".sw-tabs__custom-content");
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {
        let customFieldCard: Locator;
        if (satisfies(this.instanceMeta.version, "<6.7")) {
            customFieldCard = this.page.locator(".mt-card").filter({ hasText: translate("administration:manufacturer:detail.customFields") });
        } else {
            customFieldCard = this.page.locator(".mt-card").filter({ hasText: translate("administration:manufacturer:detail.customFields") });
        }

        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        };
    }

    url(manufacturerUuid?: string) {
        return `#/sw/manufacturer/detail/${manufacturerUuid}`;
    }
}
