import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { satisfies } from "compare-versions";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { translate } from "../../services/LanguageHelper";
import { getCustomFieldCardLocators } from "./modules/CustomFieldCard";

export class ProductDetail implements PageObject {
    public readonly contentView: Locator;
    public readonly productHeadline: Locator;

    /**
     * Save interactions
     */
    public readonly savePhysicalProductButton: Locator;
    public readonly saveButtonLoadingSpinner: Locator;
    public readonly saveButtonCheckMark: Locator;

    /**
     * General Info
     */
    public readonly manufacturerDropdownText: Locator;

    /**
     * Prices
     */
    public readonly priceGrossInput: Locator;

    /**
     * Deliverability
     */
    public readonly stockInput: Locator;
    public readonly restockTimeInput: Locator;

    /**
     * Visibility
     */
    public readonly activeForAllSalesChannelsToggle: Locator;
    public readonly tagsInput: Locator;
    public readonly saleChannelsInput: Locator;

    /**
     * Labelling
     */
    public readonly releaseDateInput: Locator;

    /**
     * Media Upload interactions
     */
    public readonly uploadMediaButton: Locator;
    public readonly coverImage: Locator;
    public readonly productImage: Locator;

    /**
     * Tabs
     */
    public readonly variantsTabLink: Locator;
    public readonly specificationsTabLink: Locator;
    public readonly advancedPricingTabLink: Locator;
    public readonly layoutTabLink: Locator;
    public readonly crossSellingTabLink: Locator;
    public readonly SEOTabLink: Locator;
    public readonly reviewsTabLink: Locator;

    /**
     * Variants Generation
     */
    public readonly generateVariantsButton: Locator;
    public readonly variantsModal: Locator;
    public readonly variantsModalHeadline: Locator;
    public readonly variantsNextButton: Locator;
    public readonly variantsSaveButton: Locator;

    /**
     * Property Selection
     */
    public readonly propertyName: (propertyName: string) => Locator;
    public readonly propertyValueCheckbox: (propertyValueName: string) => Locator;

    /** @deprecated - Use 'propertyName' instead. */
    public readonly propertyGroupColor: Locator;

    /** @deprecated - Use 'propertyName' instead. */
    public readonly propertyGroupSize: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionGrid: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionColorBlue: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionColorRed: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionColorGreen: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionSizeSmall: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionSizeMedium: Locator;

    /** @deprecated - Use 'propertyValueCheckbox' instead. */
    public readonly propertyOptionSizeLarge: Locator;

    /**
     * Cards
     */
    public readonly customFieldCard: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        this.page = page;
        this.instanceMeta = instanceMeta;

        this.contentView = page.locator(".sw-desktop__content");
        this.productHeadline = page.locator(".smart-bar__header");
        this.savePhysicalProductButton = page.getByRole("button", { name: translate("administration:product:buttons.save") });
        this.saveButtonCheckMark = page.locator(".icon--regular-checkmark-xs");
        this.saveButtonLoadingSpinner = page.locator("sw-loader");

        // Tabs
        this.specificationsTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.specifications") });
        this.advancedPricingTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.advancedPricing") });
        this.variantsTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.variants") });
        this.layoutTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.layout") });
        this.crossSellingTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.crossSelling") });
        this.SEOTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.seo") });
        this.reviewsTabLink = page.getByRole("tab", { name: translate("administration:product:tabs.reviews") });

        // General Info
        this.manufacturerDropdownText = page.locator(".sw-select-product__select_manufacturer");

        // Prices
        this.priceGrossInput = page.locator("#sw-price-field-gross").first();

        // Deliverability
        this.stockInput = page.getByPlaceholder(translate("administration:product:detail.stockPlaceholder"));
        this.restockTimeInput = page.getByPlaceholder(translate("administration:product:detail.restockTimePlaceholder"));

        // Visibility
        this.activeForAllSalesChannelsToggle = page.locator(".sw-field--product-active").getByRole("checkbox");
        this.tagsInput = page.locator(".sw-product-category-form__tag-field");
        this.saleChannelsInput = page.locator(".sw-product-detail__select-visibility");

        // Labelling
        if (satisfies(instanceMeta.version, "<6.7")) {
            this.releaseDateInput = page.locator(".sw-product-detail-base__labelling-card").locator(".form-control");
        } else {
            this.releaseDateInput = page.locator(".dp__input");
        }

        // Media upload interactions
        this.uploadMediaButton = page.getByRole("button", { name: translate("administration:product:buttons.uploadFile") });
        this.coverImage = page.locator(".sw-product-media-form__cover-image");
        this.productImage = page.locator(".sw-media-preview-v2__item");

        this.generateVariantsButton = page.getByRole("button", { name: translate("administration:product:buttons.generateVariants") });
        this.variantsModal = page.getByRole("dialog", { name: translate("administration:product:modals.generateVariants") });
        this.variantsModalHeadline = this.variantsModal.getByRole("heading", { name: translate("administration:product:modals.generateVariants") });
        this.variantsNextButton = this.variantsModal.getByRole("button", { name: translate("administration:product:buttons.next"), exact: true });
        this.variantsSaveButton = this.variantsModal.getByRole("button", { name: translate("administration:product:buttons.saveVariants") });

        // Property selection
        this.propertyName = (propertyName: string) => this.variantsModal.getByText(propertyName);
        this.propertyValueCheckbox = (propertyValueName: string) => this.variantsModal.getByRole("row", { name: propertyValueName }).getByRole("checkbox");

        this.propertyGroupColor = this.variantsModal.getByText(translate("administration:product:detail.colorProperty")).first();
        this.propertyGroupSize = this.variantsModal.getByText(translate("administration:product:detail.sizeProperty")).first();
        this.propertyOptionGrid = this.variantsModal.locator(".sw-property-search__tree-selection__option_grid");
        this.propertyOptionColorBlue = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.blue") }).getByRole("checkbox");
        this.propertyOptionColorRed = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.red") }).getByRole("checkbox");
        this.propertyOptionColorGreen = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.green") }).getByRole("checkbox");
        this.propertyOptionSizeSmall = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.small") }).getByRole("checkbox");
        this.propertyOptionSizeMedium = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.medium") }).getByRole("checkbox");
        this.propertyOptionSizeLarge = this.propertyOptionGrid.getByRole("row", { name: translate("administration:product:propertyValues.large") }).getByRole("checkbox");

        if (satisfies(instanceMeta.version, "<6.7")) {
            this.customFieldCard = page.locator(".sw-card").getByText(translate("administration:customField:general.customFields"));
        } else {
            this.customFieldCard = page.locator(".mt-card").getByText(translate("administration:customField:general.customFields"));
        }
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {
        let customFieldCard: Locator;
        if (satisfies(this.instanceMeta.version, "<6.7")) {
            customFieldCard = this.page.locator(".sw-card").filter({ hasText: translate("administration:customField:general.customFields") });
        } else {
            customFieldCard = this.page.locator(".mt-card").filter({ hasText: translate("administration:customField:general.customFields") });
        }

        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        };
    }

    url(productId: string) {
        return `#/sw/product/detail/${productId}/base`;
    }

    async getCustomFieldCardLocators(customFieldSetName: string, customFieldTextName: string) {
        return getCustomFieldCardLocators(this.page, customFieldSetName, customFieldTextName, this.instanceMeta);
    }
}
