import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ShippingDetail implements PageObject {

    public readonly header: Locator;
    public readonly nameField: Locator;
    public readonly availabilityRule: Locator;


    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');
        this.nameField = page.getByLabel('Name').first();
        this.availabilityRule = page.locator('.sw-settings-shipping-detail__top-rule').locator('.sw-entity-single-select__selection-text');
    }

    url(shippingId: string) {
        return `#/sw/settings/shipping/detail/${shippingId}`;
    }
}