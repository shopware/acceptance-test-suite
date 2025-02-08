import type { Page, Locator } from '@playwright/test';
import { ManufacturerCreate } from './ManufacturerCreate';
import { HelperFixtureTypes } from 'src/fixtures/HelperFixtures';

export class ManufacturerDetail extends ManufacturerCreate {
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);

        this.customFieldCard = page.locator('.sw-card').getByText('Custom fields');
        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
    }

    url(manufacturerUuid?: string) {
        return `#/sw/manufacturer/detail/${manufacturerUuid}`
    }
}