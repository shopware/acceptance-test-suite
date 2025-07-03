import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import {HelperFixtureTypes} from '../../fixtures/HelperFixtures';
import { getCustomFieldCardLocators } from './modules/CustomFieldCard';
import { satisfies } from 'compare-versions';

export class OrderDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;
    public readonly itemsCardHeader: Locator;

    /**
     * Tabs
     */
    public readonly generalTabLink: Locator;
    public readonly detailsTabLink: Locator;
    public readonly documentsTabLink: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.locator('.sw-order-detail__smart-bar-save-button');
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.itemsCardHeader = page.locator('.sw-card__header').getByText('Items');
        } else {
            this.itemsCardHeader = page.locator('.mt-card__header').getByText('Items');
        }

        //Tabs
        this.generalTabLink = page.getByRole('tab', { name: 'General' });
        this.detailsTabLink = page.getByRole('tab', { name: 'Details' });
        this.documentsTabLink = page.getByRole('tab', { name: 'Documents' });
    }

    url(orderId: string, tabName = 'general') {
        return `#/sw/order/detail/${orderId}/${tabName}`;
    }

    async getCustomFieldCardLocators(customFieldSetName: string, customFieldTextName: string) {
        return getCustomFieldCardLocators(this.page, customFieldSetName, customFieldTextName, this.instanceMeta);
    }
}
