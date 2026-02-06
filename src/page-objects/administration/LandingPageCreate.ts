import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class LandingPageCreate implements PageObject {
    /**
     * General
     */
    public readonly nameInput: Locator;
    public readonly landingPageStatus: Locator;
    public readonly salesChannelSelectionList: Locator;
    public readonly filtersResultPopoverItemList: Locator;
    public readonly saveLandingPageButton: Locator;
    public readonly loadingSpinner: Locator;
    public readonly seoUrlInput: Locator;

    /**
     * Layout
     */
    public readonly layoutTab: Locator;
    public readonly assignLayoutButton: Locator;
    public readonly searchLayoutInput: Locator;
    public readonly layoutItems: Locator;
    public readonly layoutSaveButton: Locator;
    public readonly layoutEmptyState: Locator;
    public readonly createNewLayoutButton: Locator;
    public readonly layoutCheckboxes: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        //Common
        this.loadingSpinner = page.locator(".sw-loader");
        this.saveLandingPageButton = page.getByRole("button", { name: translate("administration:landingPage:general.save") });
        //General
        this.nameInput = page.getByLabel(translate("administration:landingPage:general.name"));
        this.landingPageStatus = page.getByRole("checkbox", { name: translate("administration:landingPage:general.active") });
        this.salesChannelSelectionList = page
            .locator(".sw-select")
            .filter({ hasText: translate("administration:landingPage:general.salesChannels") })
            .locator(".sw-select-selection-list");
        this.filtersResultPopoverItemList = page.locator(".sw-select-result-list__content").getByRole("listitem");
        this.seoUrlInput = page.getByLabel(translate("administration:landingPage:general.seoUrl"));
        //Layout
        this.layoutTab = page.getByRole("tab", { name: translate("administration:landingPage:layout.layout") });
        const layoutCardPreview = page.locator(".sw-category-layout-card__preview");
        this.layoutEmptyState = layoutCardPreview.locator(".is--empty");
        this.assignLayoutButton = page.getByRole("button", { name: translate("administration:landingPage:create.assignLayout") });
        this.createNewLayoutButton = page.getByRole("button", { name: translate("administration:landingPage:create.createNewLayout") });
        const layoutModal = page.getByRole("dialog", { name: translate("administration:landingPage:create.selectLayout") });
        this.searchLayoutInput = layoutModal.getByPlaceholder(translate("administration:landingPage:create.searchLayoutsPlaceholder"));
        this.layoutItems = layoutModal.locator(".sw-cms-list-item");
        const layoutTable = layoutModal.locator(".sw-data-grid__body");
        this.layoutCheckboxes = layoutTable.locator(".sw-field--checkbox__content");
        this.layoutSaveButton = layoutModal.getByRole("button", { name: translate("administration:landingPage:general.save") });
    }

    url() {
        return `#/sw/category/landingPage/create/base`;
    }
}
