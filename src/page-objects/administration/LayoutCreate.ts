import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class LayoutCreate implements PageObject {
    //layout types
    public readonly shopPageButton: Locator;
    public readonly landingPageButton: Locator;
    public readonly listingPageButton: Locator;
    public readonly productPageButton: Locator;

    public readonly cancelButton: Locator;
    public readonly saveButton: Locator;

    //section types
    public readonly fullWidthButton: Locator;
    public readonly sidebarButton: Locator;
    public readonly backButton: Locator;

    //label
    public readonly layoutNameInput: Locator;
    public readonly createLayoutButton: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.shopPageButton = page.getByRole("button", { name: translate("administration:layout:create.shopPage") });
        this.landingPageButton = page.getByRole("button", { name: translate("administration:layout:create.landingPage") });
        this.listingPageButton = page.getByRole("button", { name: translate("administration:layout:create.listingPage") });
        this.productPageButton = page.getByRole("button", { name: translate("administration:layout:create.productPage") });

        this.cancelButton = page.getByRole("link", { name: translate("administration:layout:create.cancel") });
        this.saveButton = page.getByRole("button", { name: translate("administration:layout:create.save") });

        this.fullWidthButton = page.getByRole("button", { name: translate("administration:layout:create.fullWidth") });
        this.sidebarButton = page.getByRole("button", { name: translate("administration:layout:create.sidebar") });
        this.backButton = page.locator(".sw-cms-create-wizard").getByRole("button", { name: translate("administration:layout:create.back") });

        this.layoutNameInput = page.getByRole("textbox", { name: translate("administration:layout:create.layoutName") });
        this.createLayoutButton = page.getByRole("button", { name: translate("administration:layout:create.createLayout") });
    }

    url() {
        return `#/sw/cms/create`;
    }
}
