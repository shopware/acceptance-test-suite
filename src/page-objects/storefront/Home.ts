import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class Home implements PageObject {
    public readonly categoryTitle: Locator;
    public readonly accountMenuButton: Locator;
    public readonly closeGuestSessionButton: Locator;
    public readonly productImages: Locator;
    public readonly productListItems: Locator;
    public readonly loader: Locator;
    public readonly productVariantCharacteristicsOptions: Locator;
    /**
     * @deprecated Use 'Header/languagesDropdown' instead
     */
    public readonly languagesDropdown: Locator;
    /**
     * @deprecated Use 'Header/languagesMenuOptions' instead
     */
    public readonly languagesMenuOptions: Locator;
    /**
     * @deprecated Use 'Header/currenciesDropdown' instead
     */
    public readonly currenciesDropdown: Locator;
    /**
     * @deprecated Use 'Header/currenciesMenuOptions' instead
     */
    public readonly currenciesMenuOptions: Locator;
    public readonly consentOnlyTechnicallyRequiredButton: Locator;
    public readonly consentConfigureButton: Locator;
    public readonly consentAcceptAllCookiesButton: Locator;
    public readonly consentCookiePreferences: Locator;
    public readonly consentCookiePermissionContent: Locator;
    public readonly consentDialog: Locator;
    public readonly consentDialogCloseButton: Locator;
    public readonly consentDialogTechnicallyRequiredCheckbox: Locator;
    public readonly consentDialogStatisticsCheckbox: Locator;
    /**
     * @deprecated Use 'consentDialogMarketingCheckbox' instead
     */
    public readonly consentDialogMarketingdCheckbox: Locator;
    public readonly consentDialogMarketingCheckbox: Locator;
    public readonly consentDialogAcceptAllCookiesButton: Locator;
    public readonly consentDialogSaveButton: Locator;
    public readonly consentCookieBannerContainer: Locator;
    public readonly offcanvasBackdrop: Locator;
    /**
     * @deprecated Use 'Header/mainNavigationLink' instead
     */
    public readonly mainNavigationLink: Locator;
    /**
     * @deprecated Use 'Footer/contactFormLink' instead
     */
    public readonly contactFormLink: Locator;

    //wishlist
    /**
     * @deprecated Use 'Header/wishlistIcon' instead
     */
    public readonly wishlistIcon: Locator;
    /**
     * @deprecated Use 'Header/wishlistBasket' instead
     */
    public readonly wishlistBasket: Locator;

    //product filters
    public readonly filterMultiSelect: Locator;
    public readonly manufacturerFilter: Locator;
    public readonly propertyFilters: Locator;
    public readonly priceFilterButton: Locator;
    public readonly resetAllButton: Locator;
    public readonly freeShippingFilter: Locator;
    public readonly productList: Locator;
    public readonly productItemNames: Locator;
    public readonly productRatingButton: Locator;
    public readonly productRatingList: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.categoryTitle = page.getByRole('heading', { level: 1 });
        this.accountMenuButton = page.getByLabel(translate('storefront:home:account.yourAccount'));
        this.closeGuestSessionButton = page.locator('.account-aside-btn');
        this.productImages = page.locator('.product-image-wrapper');
        this.productListItems = page.locator('.product-box');
        this.languagesDropdown = page.locator('.top-bar-language').filter({ has: page.getByRole('button') });
        this.languagesMenuOptions = page.locator('.top-bar-language').filter({ has: page.getByRole('list') });
        this.currenciesDropdown = page.locator('.top-bar-currency').filter({ has: page.getByRole('button') });
        this.currenciesMenuOptions = page.locator('.top-bar-currency').filter({ has: page.getByRole('list') });
        this.consentCookieBannerContainer = page.locator('.cookie-permission-container');
        this.consentOnlyTechnicallyRequiredButton = page.getByRole('button', { name: translate('storefront:home:consent.onlyTechnicallyRequired'), exact: true });
        this.consentConfigureButton = page.getByRole('button', { name: translate('storefront:home:consent.configure'), exact: true });
        this.consentAcceptAllCookiesButton = page.getByRole('button', { name: translate('storefront:home:consent.acceptAllCookies'), exact: true });
        this.consentCookiePreferences = page.getByLabel(translate('storefront:home:consent.cookiePreferences'));
        this.consentCookiePermissionContent = page.locator('.cookie-permission-content');
        this.consentDialog = page.getByRole('dialog').filter({ hasText: translate('storefront:home:consent.cookiePreferences') });
        this.consentDialogCloseButton = this.consentDialog.getByRole('button', { name: translate('storefront:home:consent.close') });
        this.consentDialogTechnicallyRequiredCheckbox = this.consentDialog.getByRole('checkbox', {
            name: 'Technically required',
            exact: true,
        });
        this.consentDialogStatisticsCheckbox = this.consentDialog.getByRole('checkbox', {
            name: 'Statistics',
            exact: true,
        });
        this.consentDialogMarketingdCheckbox = this.consentDialog.getByRole('checkbox', { name: translate('storefront:home:consent.marketing'), exact: true });
        this.consentDialogMarketingCheckbox = this.consentDialog.getByRole('checkbox', { name: translate('storefront:home:consent.marketing'), exact: true });
        this.consentDialogSaveButton = this.consentDialog.getByRole('button', {
            name: 'Save',
            exact: true,
        });
        this.consentDialogAcceptAllCookiesButton = this.consentDialog.getByRole('button', {
            name: 'Accept all cookies',
            exact: true,
        });
        this.offcanvasBackdrop = page.locator('.offcanvas-backdrop');
        this.mainNavigationLink = page.locator('.main-navigation-link-text');
        this.contactFormLink = this.page.getByRole('listitem').getByTitle('Contact form', { exact: true });

        //wishlist
        this.wishlistIcon = page.locator('.header-wishlist-icon');
        this.wishlistBasket = page.locator('.header-wishlist-badge');

        //product filters
        this.filterMultiSelect = page.getByLabel(translate('storefront:home:filters.filterPanel')).getByRole('list');
        this.freeShippingFilter = this.filterMultiSelect.getByLabel(translate('storefront:home:filters.freeShipping'));
        this.manufacturerFilter = this.filterMultiSelect.getByRole('button', { name: translate('storefront:home:filters.manufacturer') });
        this.priceFilterButton = this.filterMultiSelect.getByRole('button', { name: translate('storefront:home:filters.price') }).first();
        this.productRatingButton = this.filterMultiSelect.getByRole('button', { name: translate('storefront:home:filters.rating') });
        this.productRatingList = this.filterMultiSelect.locator('.filter-multi-select-rating').getByRole('list');
        this.propertyFilters = page.locator('.filter-multi-select-properties');
        this.resetAllButton = page.getByRole('button', { name: translate('storefront:home:filters.resetAll') });

        this.loader = page.locator('.has-element-loader');

        this.productList = page.locator('.cms-listing-row');
        this.productItemNames = this.productList.locator('.product-name');
        this.productVariantCharacteristicsOptions = page.locator('.product-variant-characteristics-option');
    }

    async getRatingItemLocatorByRating(rating: number): Promise<Locator> {
        return this.productRatingList.getByText(`min. ${rating}/5`);
    }

    async getFilterItemByFilterName(filterName: string): Promise<Locator> {
        return this.filterMultiSelect.getByRole('checkbox', { name: filterName });
    }

    async getFilterButtonByFilterName(filterName: string): Promise<Locator> {
        return this.filterMultiSelect.getByRole('button', { name: `${translate('storefront:home:filters.labelPrefix').concat(filterName)}` });
    }

    async getMenuItemByCategoryName(categoryName: string): Promise<Record<string, Locator>> {
        const menuNavigationItem = this.page.locator('.nav-main').getByRole('link', { name: categoryName, exact: true });
        /** @deprecated - Remove, because it is obsolete.
         * The Offcanvas can only be tested on mobile viewport.
         * The content is only loaded if the navigation is triggered.
         */
        const offcanvasNavigationItem = this.page.locator('.js-navigation-offcanvas-initial-content').getByText(categoryName, { exact: true });
        const breadcrumbNavigationItem = this.page.locator('.cms-breadcrumb').getByText(categoryName, { exact: true });
        const breadcrumbNavigationLinkItem = this.page
            .locator('.breadcrumb-item')
            .filter({ has: this.page.getByText(categoryName, { exact: true }) })
            .getByRole('link');
        const flyoutCategoryLink = this.page.locator('.nav-main').locator('.navigation-flyout-category-link').getByText(categoryName);

        return {
            menuNavigationItem: menuNavigationItem,
            /** @deprecated - Remove, because it is obsolete. */
            offcanvasNavigationItem: offcanvasNavigationItem,
            breadcrumbNavigationItem: breadcrumbNavigationItem,
            breadcrumbNavigationLinkItem: breadcrumbNavigationLinkItem,
            flyoutCategoryLink: flyoutCategoryLink,
        };
    }

    /**
     * @deprecated - use getListingItemByProductName instead
     */
    async getListingItemByProductId(productId: string): Promise<Record<string, Locator>> {
        const listingItem = this.page.getByRole('listitem').filter({ has: this.page.locator(`[value="${productId}"]`) });
        const productImage = listingItem.locator('.product-image-link');
        const productRating = listingItem.locator('.product-rating');
        const productVariantCharacteristics = listingItem.locator('.product-variant-characteristics');
        const productDescription = listingItem.locator('.product-description');
        const productPriceUnit = listingItem.locator('.product-price-unit');
        const productCheapestPrice = listingItem.locator('.product-cheapest-price');
        const productPrice = listingItem.locator('.product-price');
        const productName = listingItem.locator('.product-name');
        const productAddToShoppingCart = listingItem.getByRole('button', {
            name: 'Add to shopping cart',
        });
        const productListingPrice = listingItem.locator('.list-price-price');
        const productListingPricePercentage = listingItem.locator('.list-price-percentage');
        const productListingPriceBadge = listingItem.locator('.badge-discount');
        const wishlistNotAddedIcon = listingItem.locator('.product-wishlist-not-added');
        const wishlistAddedIcon = listingItem.locator('.product-wishlist-added');

        return {
            productImage: productImage,
            productRating: productRating,
            productVariantCharacteristics: productVariantCharacteristics,
            productDescription: productDescription,
            productPriceUnit: productPriceUnit,
            productCheapestPrice: productCheapestPrice,
            productPrice: productPrice,
            productName: productName,
            productAddToShoppingCart: productAddToShoppingCart,
            productListingPrice: productListingPrice,
            productListingPricePercentage: productListingPricePercentage,
            productListingPriceBadge: productListingPriceBadge,
            wishlistNotAddedIcon: wishlistNotAddedIcon,
            wishlistAddedIcon: wishlistAddedIcon,
        };
    }

    async getListingItemByProductName(productListingName: string): Promise<Record<string, Locator>> {
        const listingItem = this.page.getByRole('listitem').filter({ hasText: productListingName });
        const productImage = listingItem.locator('.product-image-link');
        const productRating = listingItem.locator('.product-rating');
        const productVariantCharacteristics = listingItem.locator('.product-variant-characteristics');
        const productDescription = listingItem.locator('.product-description');
        const productPriceUnit = listingItem.locator('.product-price-unit');
        const productCheapestPrice = listingItem.locator('.product-cheapest-price');
        const productPrice = listingItem.locator('.product-price');
        const productName = listingItem.locator('.product-name');
        const productAddToShoppingCart = listingItem.getByRole('button', { name: translate('storefront:home:listing.addToShoppingCart')});
        const productListingPrice = listingItem.locator('.list-price-price');
        const productListingPricePercentage = listingItem.locator('.list-price-percentage');
        const productListingPriceBadge = listingItem.locator('.badge-discount');
        const wishlistNotAddedIcon = listingItem.locator('.product-wishlist-not-added');
        const wishlistAddedIcon = listingItem.locator('.product-wishlist-added');

        return {
            productImage: productImage,
            productRating: productRating,
            productVariantCharacteristics: productVariantCharacteristics,
            productDescription: productDescription,
            productPriceUnit: productPriceUnit,
            productCheapestPrice: productCheapestPrice,
            productPrice: productPrice,
            productName: productName,
            productAddToShoppingCart: productAddToShoppingCart,
            productListingPrice: productListingPrice,
            productListingPricePercentage: productListingPricePercentage,
            productListingPriceBadge: productListingPriceBadge,
            wishlistNotAddedIcon: wishlistNotAddedIcon,
            wishlistAddedIcon: wishlistAddedIcon,
        };
    }

    url() {
        return './';
    }
}
