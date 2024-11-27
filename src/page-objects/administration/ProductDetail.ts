import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ProductDetail implements PageObject {

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
    public readonly propertyGroupColor: Locator;
    public readonly propertyGroupSize: Locator;

    public readonly propertyOptionGrid: Locator;
    public readonly propertyOptionColorBlue: Locator;
    public readonly propertyOptionColorRed: Locator;
    public readonly propertyOptionColorGreen: Locator;
    public readonly propertyOptionSizeSmall: Locator;
    public readonly propertyOptionSizeMedium: Locator;
    public readonly propertyOptionSizeLarge: Locator;

    constructor(public readonly page: Page) {

        this.savePhysicalProductButton = page.getByRole('button', { name: 'Save' });
        this.saveButtonCheckMark = page.locator('.icon--regular-checkmark-xs');
        this.saveButtonLoadingSpinner = page.locator('sw-loader');

        // General Info
        this.manufacturerDropdownText = page.locator('.sw-select-product__select_manufacturer');

        // Prices
        this.priceGrossInput = page.locator('#sw-price-field-gross').first();

        // Deliverability
        this.stockInput = page.getByPlaceholder('Enter quantity in stock...');
        this.restockTimeInput = page.getByPlaceholder('Enter restock time in days...');

        // Visibility
        this.activeForAllSalesChannelsToggle = page.locator('.sw-field--product-active').getByRole('checkbox');
        this.tagsInput = page.locator('.sw-product-category-form__tag-field');
        this.saleChannelsInput = page.locator('.sw-product-detail__select-visibility');
        
        // Labelling
        this.releaseDateInput = page.locator('.sw-block-field', { hasText: 'Release Date' } ).getByPlaceholder('Enter release date...').last();

        // Media upload interactions
        this.uploadMediaButton = page.getByRole('button', { name: 'Upload file' });
        this.coverImage = page.locator('.sw-product-media-form__cover-image');
        this.productImage = page.locator('.sw-media-preview-v2__item');

        // Variant generation
        this.variantsTabLink = page.getByRole('link', { name: 'Variants' });
        this.generateVariantsButton = page.getByRole('button', { name: 'Generate variants' });
        this.variantsModal = page.getByRole('dialog', { name: 'Generate variants' });
        this.variantsModalHeadline = this.variantsModal.getByRole('heading', { name: 'Generate variants' });
        this.variantsNextButton = this.variantsModal.getByRole('button', { name: 'Next' });
        this.variantsSaveButton = this.variantsModal.getByRole('button', { name: 'Save variants' });

        // Property selection
        this.propertyGroupColor = this.variantsModal.getByText('Color').first();
        this.propertyGroupSize = this.variantsModal.getByText('Size').first();
        this.propertyOptionGrid = this.variantsModal.locator('.sw-property-search__tree-selection__option_grid');
        this.propertyOptionColorBlue = this.propertyOptionGrid.getByLabel('Blue');
        this.propertyOptionColorRed = this.propertyOptionGrid.getByLabel('Red');
        this.propertyOptionColorGreen = this.propertyOptionGrid.getByLabel('Green');
        this.propertyOptionSizeSmall = this.propertyOptionGrid.getByLabel('Small');
        this.propertyOptionSizeMedium = this.propertyOptionGrid.getByLabel('Medium');
        this.propertyOptionSizeLarge = this.propertyOptionGrid.getByLabel('Large');
    }

    url(productId: string) {
        return `#/sw/product/detail/${productId}/base`
    }
}
