import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AdminLandingPageDetail implements PageObject {

    /**
     * General
     */
    public readonly nameInput: Locator;
    public readonly landingPageStatus: Locator;
    public readonly salesChannelSelectionList: Locator;
    public readonly filtersResultPopoverItemList: Locator;
    public readonly saveLandingPageButton: Locator;
    public readonly loadingSpinner: Locator;
    public readonly seoUrlInput: Locator;

    /**
     * Layout
     */
    public readonly layoutTab: Locator;
    public readonly layoutAssignmentCardTitle: Locator;
    public readonly layoutAssignmentCardHeadline: Locator;
    public readonly changeLayoutButton: Locator;
    public readonly editInDesignerButton: Locator;
    public readonly layoutResetButton: Locator;
    public readonly layoutAssignmentStatus: Locator;
    public readonly layoutAssignmentContentSection: Locator;

    constructor(public readonly page: Page) {
        //Common
        this.loadingSpinner = page.locator('.sw-loader');
        this.saveLandingPageButton = page.getByRole('button', { name: 'Save' });
        //General
        this.nameInput = page.getByLabel('Name');
        this.landingPageStatus = page.getByRole('checkbox', { name: 'Active' });
        this.salesChannelSelectionList = page.locator('.sw-select')
            .filter({ hasText: 'Sales Channels' })
            .locator('.sw-select-selection-list');
        this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.seoUrlInput = page.getByLabel('SEO URL');
        //Layout
        this.layoutTab = page.getByRole('link', { name: 'Layout' });
        this.changeLayoutButton = page.getByRole('button', { name: 'Change layout' });
        this.editInDesignerButton = page.getByRole('button', { name: 'Edit in designer' });
        const layoutAssignmentCard = page.locator('.sw-category-layout-card');
        this.layoutAssignmentCardHeadline = layoutAssignmentCard.locator('.sw-category-layout-card__desc-headline');
        this.layoutResetButton = layoutAssignmentCard.locator('.sw-category-detail-layout__layout-reset');
        const layoutItemInfo = layoutAssignmentCard.locator('.sw-cms-list-item__info');
        this.layoutAssignmentCardTitle = layoutItemInfo.locator('.sw-cms-list-item__title');
        this.layoutAssignmentStatus = layoutItemInfo.locator('.is--active');
        this.layoutAssignmentContentSection = page.locator('.sw-cms-page-form');
    }

    url(landingPageUuid: string) {
        return `#/sw/category/landingPage/${landingPageUuid}/base`;
    }
}
