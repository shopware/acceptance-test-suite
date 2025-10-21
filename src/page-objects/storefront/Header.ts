import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class Header implements PageObject {
    public readonly mainNavigationLink: Locator;
    public readonly languagesDropdown: Locator;
    public readonly languagesMenuOptions: Locator;
    public readonly currenciesDropdown: Locator;
    public readonly currenciesMenuOptions: Locator;

    //wishlist
    public readonly wishlistIcon: Locator;
    public readonly wishlistBasket: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.mainNavigationLink = page.locator('.main-navigation-link-text');
        this.languagesDropdown = page.locator('.top-bar-language').getByRole('button'); 
        this.languagesMenuOptions = page.locator('.top-bar-language').getByRole('list');
        this.currenciesDropdown = page.getByRole('button', { name: 'Change currency' });
        this.currenciesMenuOptions = page.locator('.top-bar-currency').getByRole('list');       

        //wishlist
        this.wishlistIcon = page.getByRole('link', { name: 'Wishlist' });
        this.wishlistBasket = page.locator('.header-wishlist-badge');
    }
    
    url() {
        // Header is part of other pages and does not have a url, but the class needs a url method.
        throw new Error('Header does not have an own url.');
        return '';
    }
}