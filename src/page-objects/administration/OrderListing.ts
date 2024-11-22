import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class OrderListing implements PageObject {
    public readonly header: Locator;
    public readonly addOrderButton: Locator;
    public readonly contextMenu: Locator;
    public readonly selectAllCheckbox: Locator;
    public readonly ordersTable:Locator;
    public readonly bulkEditButton: Locator;
    public readonly bulkEditModal: Locator;
    public readonly startBulkEditButton: Locator;
    

    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');
        this.addOrderButton = page.getByText('Add order', { exact: true });
        this.contextMenu = page.locator('.sw-data-grid-settings__trigger');
        this.selectAllCheckbox = page.locator('.sw-field--checkbox').first();
        this.ordersTable = page.locator('.sw-data-grid__table');
        this.bulkEditButton = page.getByRole('button', {name: 'Bulk edit'});
        this.bulkEditModal = page.locator('.sw-product-bulk-edit-modal');
        this.startBulkEditButton = this.bulkEditModal.getByRole('button', {name: 'Start bulk edit'});
    }

    url() {
        return '#/sw/order/index/';
    }

    async getOrderRow(orderNumber: string): Promise<Record<string, Locator>> {
        const orderTableRow = this.ordersTable.locator('.sw-data-grid__row', { hasText: orderNumber });
      
        
        return {
            selectionCheckbox: orderTableRow.getByRole('checkbox'),
        };
    }
}