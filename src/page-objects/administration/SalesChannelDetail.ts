import type { Page, Locator } from "@playwright/test";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class SalesChannelDetail implements PageObject {
    public readonly generalTabLink: Locator;
    public readonly productsTabLink: Locator;
    public readonly themeTabLink: Locator;
    public readonly analyticsTabLink: Locator;
    public readonly addDomainButton: Locator;

    constructor(public readonly page: Page) {
        this.generalTabLink = page.getByRole("tab", { name: translate("administration:salesChannel:tabs.general") });
        this.productsTabLink = page.getByRole("tab", { name: translate("administration:salesChannel:tabs.products") });
        this.themeTabLink = page.getByRole("tab", { name: translate("administration:salesChannel:tabs.theme") });
        this.analyticsTabLink = page.getByRole("tab", { name: translate("administration:salesChannel:tabs.analytics") });
        this.addDomainButton = page.getByRole("button", { name: translate("administration:salesChannel:buttons.addDomain") });
    }

    url(salesChannelId: string) {
        return `#/sw/sales/channel/detail/${salesChannelId}`;
    }
}
