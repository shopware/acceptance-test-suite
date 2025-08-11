import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleListing implements PageObject {

    public readonly createRuleButton: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.createRuleButton = page.getByText('Create rule');

    }

    url() {
        return `#/sw/settings/rule/index`;
    }
}