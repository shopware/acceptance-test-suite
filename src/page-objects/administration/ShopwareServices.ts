import type { PageObject } from '../../types/PageObject';
import type { Page, Locator } from '@playwright/test';

export class ShopwareServices implements PageObject {
    public readonly header: Locator;
    public readonly deactivatedBanner: Locator
    public readonly activateServicesButton: Locator;
    public readonly permissionBanner: Locator;
    public readonly permissionGrantButton: Locator;
    public readonly serviceCards: Locator;
    public readonly deactivateServicesConfirmButton: Locator;
    public readonly deactivateServicesButton: Locator;
    public readonly deactivateServicesModal: Locator;

    constructor(public readonly page: Page) {
        this.header = page.getByRole('heading', { name: 'Future proof your store with Shopware Services' });
        this.deactivatedBanner = page.locator('.sw-settings-services-index__services-deactivated-banner');
        this.activateServicesButton = page.getByRole('button', { name: 'Activate Services' });
        this.permissionBanner = page.locator('.sw-settings-services-grant-permission-card');
        this.permissionGrantButton = page.getByRole('button', { name: 'Grant permissions' });
        this.serviceCards = page.locator('.sw-settings-services-service-card');
        this.deactivateServicesButton = page.getByRole('button', { name: 'Deactivate' });
        this.deactivateServicesModal = page.getByRole('dialog', { name: 'Deactivate Shopware Services' });
        this.deactivateServicesConfirmButton = this.deactivateServicesModal.getByRole('button', { name: 'Deactivate' });
    }

    url() {
        return '#/sw/settings/services/index/';
    }
}