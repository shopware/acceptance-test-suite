import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { CustomerGroupCreate } from "./CustomerGroupCreate";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";

export class CustomerGroupDetail extends CustomerGroupCreate implements PageObject {
    public readonly headline: Locator;
    public readonly selectedSalesChannel: Locator;
    public readonly technicalUrl: Locator;
    public readonly saleschannelUrl: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        super(page, instanceMeta);
        this.headline = page.locator(".smart-bar__header");
        this.selectedSalesChannel = page.locator(".sw-select-selection-list");
        this.technicalUrl = page.getByLabel(translate("administration:customerGroup:detail.technicalUrl"));
        this.saleschannelUrl = page.getByLabel(/.*URL/).last();
    }

    url(customerGroupId?: string) {
        return `#/sw/settings/customer/group/detail/${customerGroupId}`;
    }
}
