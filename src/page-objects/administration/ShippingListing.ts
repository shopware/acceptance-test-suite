import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ShippingListing implements PageObject {
    public readonly header: Locator;
    public readonly addShippingMethod: Locator;
    public readonly contextMenu: Locator;
    public readonly editButton: Locator;
    public readonly deleteButton: Locator;

    //warning modal
    public readonly modal: Locator;
    public readonly modalHeader: Locator;
    public readonly modalCancelButton: Locator;
    public readonly modalDeleteButton: Locator;

    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');
        this.addShippingMethod = page.getByText('Add shipping method', { exact: true });
        this.contextMenu = page.locator('.sw-data-grid-settings__trigger');
        this.editButton = page.locator('.sw-settings-shipping-list__edit-action');
        this.deleteButton = page.locator('.sw-context-menu-item--danger');

        //warning modal
        this.modal = page.getByRole('dialog', { name: 'Warning' });
        this.modalHeader = page.getByRole('heading', { name: 'Warning' });
        this.modalCancelButton = page.getByRole('button', {name: 'Cancel' });
        this.modalDeleteButton = page.getByRole('button', {name: 'Delete' });
    }

    url() {
        return '#/sw/settings/shipping/index/';
    }
}