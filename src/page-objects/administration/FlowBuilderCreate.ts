import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class FlowBuilderCreate implements PageObject {

    public readonly saveButton: Locator;
    public readonly header: Locator;
    public readonly nameField: Locator;
    public readonly flowTab: Locator;
    public readonly triggerSelectField: Locator;
    public readonly addActionField: Locator;
    public readonly smartBarHeader: Locator;


    constructor(public readonly page: Page) {
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.header = page.locator('h2');
        this.nameField = page.locator('.sw-flow-detail-general__general-name').getByLabel('Name');
        this.flowTab = page.locator('.sw-tabs__content').locator('.sw-flow-detail__tab-flow');
        this.triggerSelectField = page.locator('.sw-flow-detail-flow__trigger-card').getByRole('textbox');
        this.addActionField = page.locator('.sw-flow-sequence-action__content').locator('.sw-single-select__selection');
        this.smartBarHeader = page.locator('.smart-bar__header');
    }

    url(flowId: string, tabName = 'general') {
        return `#/sw/flow/create/${flowId}/${tabName}`;
    }
}
