import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import {HelperFixtureTypes} from '../../fixtures/HelperFixtures';
import { getCustomFieldCardLocators } from './modules/CustomFieldCard';
import { getSelectFieldListitem } from './modules/SelectFieldListitem';
import { satisfies } from 'compare-versions';

export class OrderDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;
    public readonly itemsCardHeader: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.locator('.sw-order-detail__smart-bar-save-button');
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.itemsCardHeader = page.locator('.sw-card__header').getByText('Items');
        } else {
            this.itemsCardHeader = page.locator('.mt-card__header').getByText('Items');
        }
    }

    url(orderId: string, tabName = 'general') {
        return `#/sw/order/detail/${orderId}/${tabName}`;
    }

    async getCustomFieldCardLocators(customFieldSetName: string, customFieldTextName: string) {
        return getCustomFieldCardLocators(this.page, customFieldSetName, customFieldTextName, this.instanceMeta);
    }

    async getSelectFieldListitem(selectField: Locator, listItem: string) {
        return getSelectFieldListitem(this.page, selectField, listItem, this.instanceMeta);
    }
}
