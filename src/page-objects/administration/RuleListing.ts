import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleListing implements PageObject {

    public readonly createRuleButton: Locator;
    public readonly gridCell: Locator;

    constructor(public readonly page: Page) {
        this.createRuleButton = page.getByText('Create rule');
        this.gridCell = page.locator('.sw-data-grid__cell--name');

    }

    url(searchTerm: string) {
        let url = '#/sw/settings/rule/index';
        if (searchTerm.length > 0) {
            url += `?limit=25&page=1&term=${searchTerm}`;
        }
        return url;
    }
}