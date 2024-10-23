import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class LandingPageDetail implements PageObject {

    /**
     * General
     */
    public readonly nameInput: Locator;
    public readonly landingPageStatus: Locator;
    public readonly salesChannelSelect: Locator;
    public readonly salesChannelItem: Locator;
    public readonly saveLandingPageButton: Locator;
    public readonly loadingSpinner: Locator;
    public readonly seoUrlInput: Locator;

    /**
     * Layout
     */
    public readonly layoutTab: Locator;
    public readonly assignLayoutButton: Locator;
    public readonly searchLayoutInput: Locator;
    public readonly layoutItem: Locator;
    public readonly layoutSaveButton: Locator;
    public readonly layoutAssignmentCardTitle: Locator;
    public readonly layoutAssignmentCardHeadline: Locator;
    public readonly changeLayoutButton: Locator;
    public readonly editInDesignerButton: Locator;
    public readonly layoutResetButton: Locator;
    public readonly layoutEmptyState: Locator;
    public readonly assignCreateNewLayoutButton: Locator;
    public readonly layoutAssignmentStatus: Locator;
    public readonly layoutAssignmentContentSection: Locator;

    constructor(public readonly page: Page) {
        //Common
        this.loadingSpinner = page.locator('.sw-loader');
        this.saveLandingPageButton = page.getByRole('button', { name: 'Save' });
        //General
        this.nameInput = page.getByLabel('Name');
        this.landingPageStatus = page.locator('#landingPageActive');
        this.salesChannelSelect = page.locator('.sw-landing-page-detail-base__sales_channel .sw-select-selection-list');
        this.salesChannelItem = page.locator('.sw-select-option--0');
        this.seoUrlInput = page.getByLabel('SEO URL');
        //Layout
        this.layoutTab = page.locator('.sw-landing-page-detail__tab-cms');
        this.layoutEmptyState = page.locator('.sw-cms-list-item__image.is--empty');
        this.assignLayoutButton = page.getByText('Assign layout');
        this.assignCreateNewLayoutButton = page.getByText('Create new layout');
        this.changeLayoutButton = page.getByText('Change layout');
        this.editInDesignerButton = page.getByText('Edit in designer');
        this.searchLayoutInput = page.getByPlaceholder('Search layouts...');
        this.layoutItem = page.locator('.sw-container .sw-cms-list-item__image');
        this.layoutSaveButton = page.locator('.sw-modal__footer .sw-button--primary');
        this.layoutAssignmentCardTitle = page.locator('.sw-category-layout-card__base-layout .sw-cms-list-item__title');
        this.layoutAssignmentCardHeadline = page.locator('.sw-category-layout-card__desc .sw-category-layout-card__desc-headline');
        this.layoutResetButton = page.locator('.sw-category-detail-layout__layout-reset');
        this.layoutAssignmentStatus = page.locator('.sw-cms-list-item__status.is--active');
        this.layoutAssignmentContentSection = page.locator('.sw-cms-page-form');
    }

    url() {
        return `#/sw/category/landingPage/create/base`;
    }
}
