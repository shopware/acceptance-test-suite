import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class SettingsListing implements PageObject {

    public readonly contentView: Locator;
    public readonly header: Locator;
    public readonly shopwareServicesLink: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('.sw-settings__content-header');
        this.contentView = page.locator('.sw-desktop__content');
        this.shopwareServicesLink = page.locator('.sw-settings__content-grid').getByRole('link', { name: 'Shopware Services' });
    }
    url() {
        return '#/sw/settings/index/shop';
    }
}