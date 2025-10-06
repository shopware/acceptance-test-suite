import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import type { Product } from '../../types/ShopwareTypes';

export class ProductDetail implements PageObject {

    public readonly addToCartButton: Locator;
    public readonly quantitySelect: Locator;
    public readonly productSingleImage: Locator;
    public readonly productSinglePrice: Locator;
    public readonly productPriceRangesRow: Locator;
    public readonly productListingPriceBadge: Locator;
    public readonly productListingPrice: Locator;
    public readonly productListingPricePercentage: Locator;

    public readonly offCanvasCartTitle: Locator;
    public readonly offCanvasCart: Locator;
    public readonly offCanvasCartGoToCheckoutButton: Locator;
    public readonly offCanvasLineItemImages: Locator;
    public readonly offCanvasSummaryTotalPrice: Locator;
    public readonly offCanvas: Locator;

    public readonly wishlistAddedButton: Locator;
    public readonly wishlistNotAddedButton: Locator;

    public readonly productDetailConfigurator: Locator;
    public readonly productDetailConfiguratorGroupTitle: Locator;
    public readonly productDetailConfiguratorOptionInputs: Locator;

    public readonly productName: Locator;

    //Reviews Tab
    public readonly reviewsTab: Locator;
    public readonly reviewTeaserButton: Locator;
    public readonly reviewTeaserText: Locator;
    public readonly reviewListingItems: Locator;
    public readonly reviewEmptyListingText: Locator;
    public readonly reviewLoginForm: Locator;
    public readonly forgottenPasswordLink: Locator;
    public readonly reviewForm: Locator;
    public readonly reviewRatingPoints: Locator;
    public readonly reviewRatingText: Locator;
    public readonly reviewSubmitMessage: Locator;
    public readonly reviewCounter: Locator;
    public readonly reviewItemRatingPoints: Locator;
    public readonly reviewItemTitle: Locator;
    public readonly reviewReviewTextInput: Locator;
    public readonly reviewItemContent: Locator;
    public readonly reviewLoginButton: Locator;
    public readonly reviewEmailInput: Locator;
    public readonly reviewPasswordInput: Locator;
    public readonly reviewTitleInput: Locator;
    public readonly reviewSubmitButton: Locator;
    public readonly productReviewsLink: Locator;
    public readonly productReviewRating: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;

        this.addToCartButton = page.getByRole('button', { name: 'Add to shopping cart' });
        this.quantitySelect = page.getByLabel('Quantity', { exact: true });
        this.productSingleImage = page.locator('.gallery-slider-single-image');
        this.productSinglePrice = page.locator('.product-detail-price');
        this.productPriceRangesRow = page.locator('.product-block-prices-row');
        this.productListingPriceBadge = page.locator('.list-price-badge');
        this.productListingPrice = page.locator('.list-price-price');
        this.productListingPricePercentage = page.locator('.list-price-percentage');

        this.offCanvas = page.locator('offcanvas-body');
        this.offCanvasCartTitle = page.getByText('Shopping cart', { exact: true });
        this.offCanvasCart = page.getByRole('dialog');
        this.offCanvasCartGoToCheckoutButton = page.getByRole('link', { name: 'Go to checkout' });
        this.offCanvasLineItemImages = page.locator('.line-item-img-link');
        this.offCanvasSummaryTotalPrice = page.locator('.offcanvas-summary').locator('dt:has-text("Subtotal") + dd');

        this.wishlistAddedButton = page.locator('.product-wishlist-added');
        this.wishlistNotAddedButton = page.locator('.product-wishlist-not-added');

        this.productDetailConfigurator = page.locator('.product-detail-configurator');
        this.productDetailConfiguratorGroupTitle = page.locator('.product-detail-configurator-group-title');
        this.productDetailConfiguratorOptionInputs = page.locator('.product-detail-configurator-option-input');

        this.productName = page.locator('.product-detail-name');

        this.productReviewRating = page.locator('.product-detail-reviews .product-review-rating');
        this.productReviewsLink = page.locator('.product-detail-reviews .product-detail-reviews-link');
        this.reviewsTab = this.page.getByRole('tab', { name: 'Reviews' });
        this.reviewTeaserButton = this.page.locator('.product-detail-review-teaser-btn');
        this.reviewTeaserText = this.page.locator('.product-detail-review-teaser .h4');
        this.reviewListingItems = this.page.locator('.product-detail-review-item');
        this.reviewEmptyListingText = this.page.getByText('No reviews found. Share your insights with others.');
        this.reviewLoginForm = this.page.locator('.product-detail-review-login');
        this.forgottenPasswordLink = this.page.getByRole('link', { name: 'I have forgotten my password.' });
        this.reviewLoginButton = this.page.getByRole('button', { name: 'Log in' });
        this.reviewEmailInput = this.page.getByLabel('Your email address');
        this.reviewPasswordInput = this.page.getByLabel('Your password');
        this.reviewForm = this.page.locator('.product-detail-review-form');
        this.reviewTitleInput = this.page.getByLabel('Title');
        this.reviewReviewTextInput = this.page.getByLabel('Your review');
        this.reviewSubmitButton = this.page.locator('.btn-review-submit');
        this.reviewRatingPoints = this.page.locator('.product-detail-review-form-star');
        this.reviewRatingText = this.page.locator('.product-detail-review-form-rating-text');
        this.reviewCounter = this.page.locator('.product-detail-review-counter');
        this.reviewItemRatingPoints = this.page.locator('.product-detail-review-item-points .point-full');
        this.reviewItemTitle = this.page.locator('.product-detail-review-item-title');
        this.reviewItemContent = this.page.locator('.product-detail-review-item-content');
        this.reviewSubmitMessage = this.page.getByText('Thank you for submitting your review. We will examine the review and eventually unlock it, please be patient.');
    }

    async getReviewFilterRowOptionsByName(filterOptionName: string) {
        const rowLocators = this.page.locator('.product-detail-review-filter').filter({ hasText: filterOptionName });
        const reviewFilterOptionCheckbox = rowLocators.getByLabel(filterOptionName);
        const reviewFilterOptionText = rowLocators.locator('.custom-control-label');
        const reviewFilterOptionPercentage = rowLocators.locator('.product-detail-review-share');

        return {
            reviewFilterOptionCheckbox: reviewFilterOptionCheckbox,
            reviewFilterOptionText: reviewFilterOptionText,
            reviewFilterOptionPercentage: reviewFilterOptionPercentage,
        }
    }

    url(productData: Product) {
        let namePath = '';
        if (productData.translated && productData.translated.name) {
            namePath = productData.translated.name.replaceAll('_', '-');
        }

       return `${namePath}/${productData.productNumber}`;
    }
}
