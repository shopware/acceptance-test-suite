import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class OrderListing implements PageObject {
    public readonly header: Locator;
    public readonly addOrderButton: Locator;
    public readonly contextMenu: Locator;
    public readonly selectAllCheckbox: Locator;


    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');
        this.addOrderButton = page.getByText('Add order', { exact: true });
        this.contextMenu = page.locator('.sw-data-grid-settings__trigger');
        this.selectAllCheckbox = page.locator('.sw-field--checkbox').first();


    }

    url() {
        return '#/sw/order/index/';
    }
}