import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderListing } from './FlowBuilderListing';

export class FlowBuilderTemplates extends FlowBuilderListing implements PageObject {

    public readonly searchBar: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.searchBar = page.locator('.sw-search-bar').getByPlaceholder('Search flows...');
    }
    url() {
        return `#/sw/flow/index/templates`;
    }

    async getLineItemByFlowName(flowName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.locator('.sw-data-grid__row').filter({ has: this.page.getByText(flowName, {exact: true}) });
        const createFlowLink = lineItem.getByRole('link').getByTestId('sw-icon__regular-long-arrow-right');
        const templateDetailLink = lineItem.getByRole('link').getByText(flowName);

        return {
            createFlowLink: createFlowLink,
            lineItem: lineItem,
            templateDetailLink: templateDetailLink,
        }
    }
}