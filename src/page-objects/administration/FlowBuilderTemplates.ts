import type { Page } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderListing } from './FlowBuilderListing';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class FlowBuilderTemplates extends FlowBuilderListing implements PageObject {

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
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