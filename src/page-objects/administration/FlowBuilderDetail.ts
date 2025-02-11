import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderCreate } from './FlowBuilderCreate';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class FlowBuilderDetail extends FlowBuilderCreate implements PageObject {

    public readonly saveButton: Locator;
    public readonly generalTab: Locator;
    public readonly flowTab: Locator;
    public readonly flowName: Locator;
    public readonly alertWarning: Locator;
    public readonly templateName: Locator;
    public readonly alertMessage: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page);
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.generalTab = page.locator('.sw-flow-detail__tab-general');
            this.alertWarning = page.getByRole('alert').first();
            this.alertMessage = page.locator('.sw-alert__title');
        } else {
            this.generalTab = page.locator('.mt-tabs__item').getByText('General');
            this.alertWarning = page.getByRole('banner').first();
            this.alertMessage = page.locator('.mt-banner__title');
        }
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.flowTab = page.locator('.sw-flow-detail__tab-flow');
        this.flowName = page.getByTestId('sw-field--flow-name');
        this.templateName = page.getByLabel(('Name'));
    }

    url(flowId: string, tabName = 'general') {
        return `#/sw/flow/detail/${flowId}/${tabName}`
    }
}