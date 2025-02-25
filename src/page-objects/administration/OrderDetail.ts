import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { CustomFieldLocators } from './modules/CustomFields';
import {HelperFixtureTypes} from '../../fixtures/HelperFixtures';

export class OrderDetail implements PageObject {
    public readonly saveButton: Locator;
    public readonly dataGridContextButton: Locator;
    public readonly orderTag: Locator;
    public readonly customFieldLocators: CustomFieldLocators;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.locator('.sw-order-detail__smart-bar-save-button');
        this.dataGridContextButton = page.locator('.sw-data-grid__actions-menu').and(page.getByRole('button'));
        this.orderTag = page.locator('.sw-select-selection-list__item');
        this.customFieldLocators = new CustomFieldLocators(page, this.instanceMeta);
    }

    url(orderId: string, tabName = 'general') {
        return `#/sw/order/detail/${orderId}/${tabName}`;
    }

    async customFields(customFieldSetName: string, customFieldTextName: string) {
        return await this.customFieldLocators.getLocators(customFieldSetName, customFieldTextName);
    }
}
