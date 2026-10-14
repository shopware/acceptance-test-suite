import type { Page, Locator } from "@playwright/test";
import { satisfies } from "compare-versions";
import type { PageObject } from "../../types/PageObject";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";
import type { ProductCreationType } from "../../types/ShopwareTypes";

/**
 * Matches a form field by its label. Before 6.7 the accessible name of a required field ends with "*".
 */
function fieldName(label: string): RegExp {
    return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\*?$`);
}

export class ProductCreate implements PageObject {
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    public readonly headline: Locator;

    /**
     * General information
     */
    public readonly nameInput: Locator;
    public readonly productNumberInput: Locator;

    /**
     * Prices
     */
    public readonly priceGrossInput: Locator;
    public readonly priceNetInput: Locator;

    /**
     * Deliverability
     */
    public readonly stockInput: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;

        this.headline = page.locator(".smart-bar__header");

        this.nameInput = page.getByRole("textbox", {
            name: fieldName(translate("administration:product:detail.name")),
        });
        this.productNumberInput = page.getByRole("textbox", {
            name: fieldName(translate("administration:product:detail.productNumber")),
        });

        // Several labels point at the same price input ids, so the accessible name is not unique here.
        this.priceGrossInput = page.locator("#sw-price-field-gross").first();
        this.priceNetInput = page.locator("#sw-price-field-net").first();

        this.stockInput = page.getByRole("textbox", {
            name: translate("administration:product:detail.stock"),
            exact: true,
        });
    }

    /**
     * Returns the url to the creation page.
     *
     * @param creationType - Physical products are created by default, digital products carry a file instead of stock.
     */
    url(creationType: ProductCreationType = "physical") {
        // Product types replaced the creation states in 6.7.7.
        if (satisfies(this.instanceMeta.version, "<6.7.7")) {
            return `#/sw/product/create/base?creationStates=${creationType === "digital" ? "is-download" : "is-physical"}`;
        }

        return `#/sw/product/create/base?creationType=${creationType}`;
    }
}
