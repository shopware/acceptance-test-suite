import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class SettingsListing implements PageObject {
    public readonly header: Locator;


    constructor(public readonly page: Page) {
        this.header = page.locator('.sw-settings__content-header');

    }

    url() {
        return '#/sw/settings/index/shop';
    }
}