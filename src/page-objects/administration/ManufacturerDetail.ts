import type { Page, Locator } from '@playwright/test';
import { ManufacturerCreate } from './ManufacturerCreate';
import { HelperFixtureTypes } from 'src/fixtures/HelperFixtures';

export class ManufacturerDetail extends ManufacturerCreate {
    public readonly customFieldCard: Locator;
    public readonly customFieldSetTabs: Locator;
    public readonly customFieldSetTabCustomContent: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);

        this.customFieldCard = page.locator('.mt-card').getByText('Custom fields');
        this.customFieldSetTabs = this.customFieldCard.locator('.sw-tabs-item');
        this.customFieldSetTabCustomContent = this.customFieldCard.locator('.sw-tabs__custom-content');
    }

    async getCustomFieldSetCardContentByName(customFieldSetName: string): Promise<Record<string, Locator>> {

        const customFieldCard = this.page.locator('.mt-card').filter({hasText: 'Custom fields'});
        const customFieldSetTab = customFieldCard.getByText(customFieldSetName);
        const customFieldSetTabCustomContent = customFieldCard.locator(`.sw-custom-field-set-renderer-tab-content__${customFieldSetName}`);

        return {
            customFieldSetTab: customFieldSetTab,
            customFieldSetTabCustomContent: customFieldSetTabCustomContent,
        }
    }

    url(manufacturerUuid?: string) {
        return `#/sw/manufacturer/detail/${manufacturerUuid}`
    }
}