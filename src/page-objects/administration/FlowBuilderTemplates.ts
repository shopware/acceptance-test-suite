import type { Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderListing } from './FlowBuilderListing';

export class FlowBuilderTemplates extends FlowBuilderListing implements PageObject {

    constructor(page: Page) {
        super(page);
    }

    url() {
        return `#/sw/flow/index/templates`;
    }

    async getLineItemByFlowName(flowName: string) {
        const lineItem = this.page.locator('.sw-data-grid__row').filter({ has: this.page.getByText(flowName, {exact: true}) });
        const createFlowLink = lineItem.getByRole('link').getByText('Create new flow from template');
        const templateDetailLink = lineItem.getByRole('link').getByText(flowName);
        return {
            createFlowLink: createFlowLink,
            lineItem: lineItem,
            templateDetailLink: templateDetailLink,
        };
    }
}