import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class OrderBulkEdit implements PageObject {
    public readonly header: Locator;
    public readonly statusCard: Locator;
    public readonly changePaymentStatus: Locator;



    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');

        //Status Card
        this.statusCard = page.locator('.sw-bulk-edit-order-base__status');
        this.changePaymentStatus = page.getByText('Change: Payment status');


        

    }

    url() {
        return '#/sw/order/index/';
    }
}