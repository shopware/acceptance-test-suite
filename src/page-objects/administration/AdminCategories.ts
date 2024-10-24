import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AdminCategories implements PageObject {

    /**
     * Landing pages
     */
    public readonly landingPageArea: Locator;
    public readonly landingPageHeadline: Locator;
    public readonly addLandingPageButton: Locator;
    public readonly landingPageItems: Locator;

    constructor(public readonly page: Page) {

        this.landingPageArea = page.locator('.sw-category-detail__landing-page-collapse');
        this.landingPageHeadline = this.landingPageArea.getByRole('heading', { name: 'Landing pages' });
        this.addLandingPageButton = this.landingPageArea.getByText('Add landing page');
        this.landingPageItems = this.landingPageArea.locator('.sw-tree-item__label');
    }

    url() {
        return `#/sw/category/index`
    }
}
