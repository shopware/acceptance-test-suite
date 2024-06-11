import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class FlowBuilderDetail implements PageObject {

    public readonly saveButton: Locator;
    public readonly generalTab: Locator;
    public readonly flowTab: Locator;

    constructor(public readonly page: Page) {
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        this.flowTab = page.locator('.sw-flow-detail__tab-flow');
    }

    url(flowId: string, tabName = 'general') {
        return `#/sw/flow/detail/${flowId}/${tabName}`
    }
}