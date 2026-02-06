import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class ShippingListing implements PageObject {
    public readonly header: Locator;
    public readonly addShippingMethod: Locator;
    public readonly contextMenu: Locator;
    public readonly editButton: Locator;
    public readonly deleteButton: Locator;

    //warning modal
    public readonly modal: Locator;
    public readonly modalHeader: Locator;
    public readonly modalCancelButton: Locator;
    public readonly modalDeleteButton: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator(".smart-bar__header");
        this.addShippingMethod = page.getByText(translate("administration:shipping:listing.addShippingMethod"), { exact: true });
        this.contextMenu = page.locator(".sw-data-grid-settings__trigger");
        this.editButton = page.locator(".sw-settings-shipping-list__edit-action");
        this.deleteButton = page.locator(".sw-context-menu-item--danger");

        //warning modal
        this.modal = page.getByRole("dialog", { name: translate("administration:shipping:dialogs.warning") });
        this.modalHeader = this.modal.getByRole("heading", { name: translate("administration:shipping:dialogs.warning") });
        this.modalCancelButton = this.modal.getByRole("button", { name: translate("administration:shipping:dialogs.cancel") });
        this.modalDeleteButton = this.modal.getByRole("button", { name: translate("administration:shipping:dialogs.delete") });
    }

    url() {
        return "#/sw/settings/shipping/index/";
    }
}
