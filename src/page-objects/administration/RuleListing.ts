import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';


export class RuleListing implements PageObject {
    public readonly createRuleButton: Locator;
    public readonly header: Locator;
    public readonly grid: Locator;
    public readonly page: Page;


    constructor(page: Page) {
        this.page = page;
        this.createRuleButton = page.getByText('Create rule');
        this.header = page.locator('.smart-bar__header');
        this.grid = page.locator('sw-data-grid__table)');
    }

    url() {
        return `#/sw/settings/rule/index`;
    }
}