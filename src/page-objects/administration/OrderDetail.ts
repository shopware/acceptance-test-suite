import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class OrderDetail implements PageObject {
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;

    constructor(public readonly page: Page) {
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
    }

    async goTo({ orderId }: Record<string, unknown>) {
        await this.page.goto(`#/sw/order/detail/${orderId}/general`);
    }
}
