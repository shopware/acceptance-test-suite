import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { CustomerGroupCreate } from './CustomerGroupCreate';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class CustomerGroupDetail extends CustomerGroupCreate implements PageObject {
    public readonly headline: Locator;
    public readonly selectedSalesChannel: Locator;
    public readonly technicalUrl: Locator;
    public readonly saleschannelUrl: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
        this.headline = page.locator('.smart-bar__header');
        this.selectedSalesChannel = page.locator('.sw-select-selection-list');
        this.technicalUrl = page.getByLabel('Technical URL');
        this.saleschannelUrl = page.getByLabel(/.*URL/).last();
    }

    url(customerGroupId?: string) {
        return `#/sw/settings/customer/group/detail/${customerGroupId}`;
    }
}