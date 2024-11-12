import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleDetail implements PageObject {

    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;

    constructor(public readonly page: Page) {
        this.nameInput = page.getByLabel('Name');
        this.priorityInput = page.getByLabel('Priority')
    }

    url(ruleId: string, tabName = 'base') {
        return `#/sw/settings/rule/detail/${ruleId}/${tabName}`
    }
}