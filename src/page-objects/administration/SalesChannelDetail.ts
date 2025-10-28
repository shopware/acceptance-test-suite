import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class SalesChannelDetail implements PageObject {

    public readonly generalTabLink: Locator;
    public readonly productsTabLink: Locator;
    public readonly themeTabLink: Locator;
    public readonly analyticsTabLink: Locator;
    public readonly addDomainButton: Locator;

     constructor(public readonly page: Page) {

        this.generalTabLink = page.getByRole('tab', { name: 'General' });
        this.productsTabLink = page.getByRole('tab', { name: 'Products' });
        this.themeTabLink = page.getByRole('tab', { name: 'Theme' });
        this.analyticsTabLink = page.getByRole('tab', { name: 'Analytics' });
        this.addDomainButton = page.getByRole('button', { name: 'Add domain' });
     }

    url(salesChannelId: string) {
        return `#/sw/sales/channel/detail/${salesChannelId}`;
    }
}