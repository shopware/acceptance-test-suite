import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class FlowBuilderDetail implements PageObject {

    public readonly generalTab: Locator;
    public readonly flowTab: Locator;

    constructor(public readonly page: Page) {
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        this.flowTab = page.locator('.sw-flow-detail__tab-flow');
    }

    async goTo(flowId: string, tabName: string) {
        await this.page.goto(`#/sw/flow/detail/${ flowId }/${ tabName }`);
    }
}