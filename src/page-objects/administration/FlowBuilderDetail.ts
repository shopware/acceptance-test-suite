import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderCreate } from './FlowBuilderCreate';
import { satisfies } from 'compare-versions';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { getTooltipText } from './modules/TooltipText';

export class FlowBuilderDetail extends FlowBuilderCreate implements PageObject {

    public readonly saveButtonLoader: Locator;
    public readonly saveButton: Locator;
    public readonly generalTab: Locator;
    public readonly flowTab: Locator;
    public readonly alertWarning: Locator;
    public readonly templateName: Locator;
    public readonly alertMessage: Locator;
    public readonly successMessage: Locator;
    public readonly actionContentTag: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.successMessage = page.locator('.sw-alert__title');
            this.saveButtonLoader = page.locator('.sw-button--primary').locator('.sw-button_loader');
            this.alertWarning = page.getByRole('alert').first();
            this.alertMessage = page.locator('.sw-alert__title');
        } else {
            this.successMessage = page.locator('.mt-banner__title');
            this.saveButtonLoader = page.locator('.mt-button--primary').locator('.mt-button__loader');
            this.alertWarning = page.getByRole('banner').first();
            this.alertMessage = page.locator('.mt-banner__title');
        }
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.flowTab = page.locator('.sw-flow-detail__tab-flow');
        this.templateName = page.getByLabel('Name');
        this.actionContentTag = page.locator('.sw-flow-sequence-action__content').locator('.tag');
    }

    url(flowId: string, tabName = 'general') {
        if (!flowId || flowId === '') {
            return `#/sw/flow/detail/${tabName}`;
        }
        return `#/sw/flow/detail/${flowId}/${tabName}`;
    }

    async getTooltipText(toolTipArea: Locator): Promise<string> {
        return await getTooltipText(this.page, toolTipArea);
    }
}