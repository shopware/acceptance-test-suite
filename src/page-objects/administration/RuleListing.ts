import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleListing implements PageObject {

    public readonly createRuleButton: Locator;

    constructor(public readonly page: Page) {
        this.createRuleButton = page.getByText('Create rule');

    }

    url() {
        return `#/sw/settings/rule/index`;
    }
}