import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class FlowBuilderCreate implements PageObject {

    public readonly saveButton: Locator;
    public readonly header: Locator;

    constructor(public readonly page: Page) {
        this.saveButton = page.locator('.sw-flow-detail__save');
        this.header = page.locator('h2');
    }

    url() {
        return '#/sw/flow/create/general';
    }
}
