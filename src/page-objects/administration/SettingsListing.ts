import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class SettingsListing implements PageObject {

    public readonly contentView: Locator;
    public readonly header: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('.sw-settings__content-header');
        this.contentView = page.locator('.sw-desktop__content');
    }
    url() {
        return '#/sw/settings/index/shop';
    }
}