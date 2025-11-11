import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class Header implements PageObject {
    public readonly mainNavigationLink: Locator;
    public readonly topBarNav: Locator;
    public readonly languagesDropdown: Locator;
    public readonly languagesMenuOptions: Locator;
    public readonly currenciesDropdown: Locator;
    public readonly currenciesMenuOptions: Locator;
    public readonly searchInput: Locator;

    //skip links
    public readonly skipToMainContentLink: Locator;

    //wishlist
    public readonly wishlistIcon: Locator;
    public readonly wishlistBasket: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.mainNavigationLink = page.locator('.main-navigation-link-text');
        this.topBarNav = page.getByRole('navigation', { name: translate('storefront:header:topBarNav') });
        this.languagesDropdown = this.topBarNav.locator('.top-bar-language').getByRole('button', { name: translate('storefront:header:languageDropdown') });
        this.languagesMenuOptions = this.topBarNav.locator('.top-bar-language').getByRole('list');
        this.currenciesDropdown = this.topBarNav.locator('.top-bar-currency').getByRole('button', { name: translate('storefront:header:currencyDropdown') });
        this.currenciesMenuOptions = this.topBarNav.locator('.top-bar-currency').getByRole('list');       
        this.searchInput = page.getByLabel(translate('storefront:header:searchInputAriaLabel'));        

        //skip links
        this.skipToMainContentLink = page.getByRole('link', { name: translate('storefront:header:skipToContentLink'), exact: true });

        //wishlist
        this.wishlistIcon = page.getByRole('link', { name: translate('storefront:header:wishlistIcon') });
        this.wishlistBasket = page.locator('.header-wishlist-badge');
    }
    
    url() {
        // Header is part of other pages and does not have a url, but the class needs a url method.
        throw new Error('Header does not have an own url.');
        return '';
    }
}