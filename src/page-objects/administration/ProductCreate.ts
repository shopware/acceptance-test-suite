import type { Page, Locator } from "@playwright/test";
import type { PageObject } from "../../types/PageObject";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";
import type { ProductCreationType } from "../../types/ShopwareTypes";

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
            name: translate("administration:product:detail.name"),
            exact: true,
        });
        this.productNumberInput = page.getByRole("textbox", {
            name: translate("administration:product:detail.productNumber"),
            exact: true,
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
        return `#/sw/product/create/base?creationType=${creationType}`;
    }
}
