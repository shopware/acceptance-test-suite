import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { FlowBuilderCreate } from './FlowBuilderCreate';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class FlowBuilderDetail extends FlowBuilderCreate implements PageObject {

    public readonly successMessage: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.successMessage = page.locator('.sw-alert__title');
        } else {
            this.successMessage = page.locator('.mt-banner__title');
        }


    }

    url(flowId?: string, tabName = 'general') {
        return `#/sw/flow/detail/${flowId}/${tabName}`
    }
}