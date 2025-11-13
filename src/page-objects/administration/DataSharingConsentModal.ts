import type { Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class DataSharingConsentModal implements PageObject {

    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;

    }

    url() {
        return new Error('Method not implemented, because it is a modal which can not be routed.').message;
    }
}
