import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class ShopwareServices implements PageObject {
    public readonly header: Locator;
    public readonly deactivatedBanner: Locator;
    public readonly activateServicesButton: Locator;
    public readonly permissionBanner: Locator;
    public readonly permissionGrantButton: Locator;
    public readonly serviceCards: Locator;
    public readonly deactivateServicesConfirmButton: Locator;
    public readonly deactivateServicesButton: Locator;
    public readonly deactivateServicesModal: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.getByRole("heading", { name: translate("administration:shopwareServices:headings.futureProofStore") });
        this.deactivatedBanner = page.locator(".sw-settings-services-index__services-deactivated-banner");
        this.activateServicesButton = page.getByRole("button", { name: translate("administration:shopwareServices:buttons.activateServices") });
        this.permissionBanner = page.locator(".sw-settings-services-grant-permission-card");
        this.permissionGrantButton = page.getByRole("button", { name: translate("administration:shopwareServices:buttons.grantPermissions") });
        this.serviceCards = page.locator(".sw-settings-services-service-card");
        this.deactivateServicesButton = page.getByRole("button", { name: translate("administration:shopwareServices:buttons.deactivate") });
        this.deactivateServicesModal = page.getByRole("dialog", { name: translate("administration:shopwareServices:modals.deactivateServices") });
        this.deactivateServicesConfirmButton = this.deactivateServicesModal.getByRole("button", { name: translate("administration:shopwareServices:buttons.deactivate") });
    }

    url() {
        return "#/sw/settings/services/index/";
    }
}
