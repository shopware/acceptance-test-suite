import type { Page, Locator } from "@playwright/test";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class ProductListing implements PageObject {
    /**
     * Smart bar
     *
     * A digital product is only reachable through the split button next to "Add product".
     */
    public readonly addProductButton: Locator;
    public readonly addProductContextMenuButton: Locator;
    public readonly addDigitalProductLink: Locator;

    /**
     * Multi selection
     */
    public readonly productsTable: Locator;
    public readonly bulkEditButton: Locator;
    public readonly page: Page;

    /**
     * Bulk edit modal
     */
    public readonly bulkEditModal: Locator;
    public readonly startBulkEditButton: Locator;

    /**
     * Row actions and deletion
     */
    public readonly deleteContextMenuItem: Locator;
    public readonly deleteConfirmationModal: Locator;
    public readonly confirmDeleteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addProductButton = page.getByRole("button", {
            name: translate("administration:product:listing.addProduct"),
        });
        // The split button toggle only renders a chevron icon, so it has no accessible name to query by.
        this.addProductContextMenuButton = page.locator(".sw-product-list__button-context-menu");
        this.addDigitalProductLink = page.getByRole("link", {
            name: translate("administration:product:listing.addDigitalProduct"),
        });
        this.productsTable = page.locator(".sw-data-grid__table");
        this.bulkEditButton = page.getByRole("button", {
            name: translate("administration:product:listing.bulkEdit"),
        });

        // The listing renders one "Delete" entry per row menu and another one in the confirmation
        // modal, so the row entry is matched by its class and the confirmation is modal scoped.
        this.deleteContextMenuItem = page.locator(".sw-entity-listing__context-menu-edit-delete");
        this.deleteConfirmationModal = page.locator(".sw-modal");
        this.confirmDeleteButton = this.deleteConfirmationModal.getByRole("button", {
            name: translate("administration:product:buttons.delete"),
            exact: true,
        });

        this.bulkEditModal = page.locator(".sw-product-bulk-edit-modal");
        this.startBulkEditButton = this.bulkEditModal.getByRole("button", {
            name: translate("administration:product:listing.startBulkEdit"),
        });
    }

    /**
     * Returns the url to the listing page.
     *
     * @param searchTerms - Includes search terms for filtering of the product list.
     */
    url(searchTerms: string[] = []) {
        let url = "#/sw/product/index";
        if (searchTerms.length > 0) {
            let tempTerm = "";
            for (const searchTerm of searchTerms) {
                if (tempTerm != "") {
                    tempTerm += "+";
                }
                tempTerm += searchTerm;
            }
            url += `?limit=25&page=1&term=${tempTerm}`;
        }
        return url;
    }

    /**
     * Returns the table row containing the product with the given product number.
     *
     * @param productNumber - Product number you are looking for.
     */
    async getProductRow(productNumber: string): Promise<Record<string, Locator>> {
        const productTableRow = this.productsTable.locator(".sw-data-grid__row", {
            hasText: productNumber,
        });
        const productNameSelector = ".sw-data-grid__cell--name";
        const productNumberSelector = ".sw-data-grid__cell--productNumber";
        const productManufacturerSelector = ".sw-data-grid__cell--manufacturer-name";
        const productDigitalIndicatorSelector = ".sw-product-list__digital-indicator";
        // The icon component prefix changed from "sw-icon" to "mt-icon", the icon class did not.
        const productActiveSelector = ".icon--regular-checkmark-xs";
        const productInactiveSelector = ".icon--regular-times-s";
        const productStockSelector = ".sw-data-grid__cell--stock";
        const productAvailableStockSelector = ".sw-data-grid__cell--availableStock";
        const productActionsMenuSelector = ".sw-data-grid__actions-menu";
        const productPriceSelector = ".sw-data-grid__cell--price-EUR";

        return {
            selectionCheckbox: productTableRow.getByRole("checkbox"),
            productName: productTableRow.locator(productNameSelector),
            productDigitalIndicator: productTableRow.locator(productDigitalIndicatorSelector),
            productNumber: productTableRow.locator(productNumberSelector),
            productManufacturer: productTableRow.locator(productManufacturerSelector),
            productActive: productTableRow.locator(productActiveSelector),
            productInactive: productTableRow.locator(productInactiveSelector),
            productPrice: productTableRow.locator(productPriceSelector),
            productStock: productTableRow.locator(productStockSelector),
            productAvailableStock: productTableRow.locator(productAvailableStockSelector),
            actionsMenuButton: productTableRow.locator(productActionsMenuSelector),
        };
    }
}
