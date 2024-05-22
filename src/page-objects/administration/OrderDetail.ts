import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import type { components } from '@shopware/api-client/admin-api-types';

export class OrderDetail implements PageObject {
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;

    public readonly orderData: components['schemas']['Order'];

    constructor(public readonly page: Page, orderData: components['schemas']['Order']) {
        this.orderData = orderData;
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
    }

    async goTo() {
        await this.page.goto(`#/sw/order/detail/${this.orderData.id}/general`);
    }
}
