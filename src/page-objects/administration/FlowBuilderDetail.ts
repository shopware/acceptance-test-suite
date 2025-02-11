import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderCreate } from './FlowBuilderCreate';

export class FlowBuilderDetail extends FlowBuilderCreate implements PageObject {

    public readonly saveButton: Locator;
    public readonly generalTab: Locator;
    public readonly flowTab: Locator;
    public readonly flowName: Locator;
    public readonly alertWarning: Locator;
    public readonly templateName: Locator;
    public readonly alertMessage: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.generalTab = page.locator('.sw-flow-detail__tab-general');
        this.flowTab = page.locator('.sw-flow-detail__tab-flow');
        this.flowName = page.getByTestId('sw-field--flow-name');
        this.alertWarning = page.getByRole('alert').first();
        this.templateName = page.getByLabel(('Name'));
        this.alertMessage = page.locator('.sw-alert__title');
    }

    url(flowId: string, tabName = 'general') {
        return `#/sw/flow/detail/${flowId}/${tabName}`
    }
}