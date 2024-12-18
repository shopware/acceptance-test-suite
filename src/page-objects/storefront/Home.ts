import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Home implements PageObject {

    public readonly productImages: Locator;
    public readonly productListItems: Locator;
    public readonly languagesDropdown: Locator;
    public readonly languagesMenuOptions: Locator;
    public readonly currenciesDropdown: Locator;
    public readonly currenciesMenuOptions: Locator;
    public readonly consentOnlyTechnicallyRequiredButton: Locator;
    public readonly consentConfigureButton: Locator;
    public readonly consentAcceptAllCookiesButton: Locator;
    public readonly consentCookiePreferences: Locator;
    public readonly consentCookiePermissionContent: Locator;
    public readonly consentDialog: Locator;
    public readonly consentDialogTechnicallyRequiredCheckbox: Locator;
    public readonly consentDialogStatisticsCheckbox: Locator;
    public readonly consentDialogMarketingdCheckbox: Locator
    public readonly consentDialogAcceptAllCookiesButton: Locator;
    public readonly consentDialogSaveButton: Locator;
    public readonly consentCookieBannerContainer: Locator;
    public readonly offcanvasBackdrop: Locator;

    constructor(public readonly page: Page) {
        this.productImages = page.locator('.product-image-link');
        this.productListItems = page.getByRole('listitem');
        this.languagesDropdown = page.locator('.top-bar-language').filter({ has: page.getByRole('button') });
        this.languagesMenuOptions = page.locator('.top-bar-language').filter({ has: page.getByRole('list') });
        this.currenciesDropdown = page.locator('.top-bar-currency').filter({ has: page.getByRole('button') });
        this.currenciesMenuOptions = page.locator('.top-bar-currency').filter({ has: page.getByRole('list') });
        this.consentCookieBannerContainer = page.locator('.cookie-permission-container');
        this.consentOnlyTechnicallyRequiredButton = page.getByRole('button', { name: 'Only technically required', exact: true });
        this.consentConfigureButton = page.getByRole('button', { name: 'Configure', exact: true });
        this.consentAcceptAllCookiesButton = page.getByRole('button', { name: 'Accept all cookies', exact: true });
        this.consentCookiePreferences = page.getByLabel('Cookie preferences');
        this.consentCookiePermissionContent = page.locator('.cookie-permission-content');
        this.consentDialog = page.getByRole('dialog').filter( { hasText: 'Cookie preferences' });
        this.consentDialogTechnicallyRequiredCheckbox = this.consentDialog.getByRole('checkbox', { name: 'Technically required', exact: true });
        this.consentDialogStatisticsCheckbox = this.consentDialog.getByRole('checkbox', { name: 'Statistics', exact: true });
        this.consentDialogMarketingdCheckbox = this.consentDialog.getByRole('checkbox', { name: 'Marketing', exact: true });
        this.consentDialogSaveButton = this.consentDialog.getByRole('button', { name: 'Save', exact: true });
        this.consentDialogAcceptAllCookiesButton = this.consentDialog.getByRole('button', { name: 'Accept all cookies', exact: true });
        this.offcanvasBackdrop = page.locator('.offcanvas-backdrop');

    }

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
        const productAddToShoppingCart = listingItem.getByRole('button', { name: 'Add to shopping cart' });

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
        }
    }

    url() {
        return './';
    }
}
