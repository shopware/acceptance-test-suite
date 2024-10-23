import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Categories implements PageObject {

    /**
     * Landing pages
     */
    public readonly landingPageArea: Locator;
    public readonly landingPageHeadline: Locator;
    public readonly addLandingPageButton: Locator;
    public readonly landingPageItems: Locator;

    constructor(public readonly page: Page) {

        this.landingPageArea = page.locator('.sw-category-detail__landing-page-collapse');
        this.landingPageHeadline = this.landingPageArea.locator('.sw-category-detail__collapse-headline');
        this.addLandingPageButton = this.landingPageArea.locator('.sw-landing-page-tree__add-button-button');
        this.landingPageItems = this.landingPageArea.locator('.sw-landing-page-tree .sw-tree-item__label');
    }

    url() {
        return `#/sw/category/index`
    }
}
