import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class OrderDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;

    constructor(public readonly page: Page) {
        this.saveButton = page.locator('.sw-order-detail__smart-bar-save-button');
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
    }

    url(orderId: string | undefined) {
        return `#/sw/order/detail/${orderId}/general`;
    }
}
