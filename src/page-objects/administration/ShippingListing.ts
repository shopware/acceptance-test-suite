import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class ShippingListing implements PageObject {
    public readonly header: Locator;
    public readonly addShippingMethod: Locator;
    public readonly firstShippigMethodName: Locator;
    public readonly firstShippingMethodContextButton: Locator;
    public readonly contextMenu: Locator;
    public readonly editButton: Locator;
    public readonly deleteButton: Locator;

    //warning modal
    public readonly modal: Locator;
    public readonly modalHeader: Locator;
    public readonly modalCancelButton: Locator;
    public readonly modalDeleteButton: Locator;

    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header')
        this.addShippingMethod = page.getByText('Add shipping method', { exact: true });
        this.firstShippigMethodName = page.locator('.sw-data-grid__cell--name a').first();
        this.firstShippingMethodContextButton = page.locator('.sw-data-grid__actions-menu').first();
        this.contextMenu = page.locator('.sw-data-grid-settings__trigger');
        this.editButton = page.locator('.sw-settings-shipping-list__edit-action');
        this.deleteButton = page.locator('.sw-context-menu-item--danger');

        //warning modal
        this.modal = page.locator('.sw-modal__dialog');
        this.modalHeader = page.getByText('Warning', { exact: true });
        this.modalCancelButton = page.getByText('Cancel', { exact: true });
        this.modalDeleteButton = page.locator('.sw-button--danger');
    }

    url() {
        return '#/sw/settings/shipping/index/';
    }
}

