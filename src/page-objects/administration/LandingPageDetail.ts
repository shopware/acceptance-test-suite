import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class LandingPageDetail implements PageObject {
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
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        //Common
        this.loadingSpinner = page.locator('.sw-loader');
        this.saveLandingPageButton = page.getByRole('button', { name: translate('administration:landingPage:general.save') });
        //General
        this.nameInput = page.getByLabel(translate('administration:landingPage:general.name'));
        this.landingPageStatus = page.getByRole('checkbox', { name: translate('administration:landingPage:general.active') });
        this.salesChannelSelectionList = page
            .locator('.sw-select')
            .filter({ hasText: translate('administration:landingPage:general.salesChannels') })
            .locator('.sw-select-selection-list');
        this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.seoUrlInput = page.getByLabel(translate('administration:landingPage:general.seoUrl'));
        //Layout
        this.layoutTab = page.getByRole('tab', { name: translate('administration:landingPage:layout.layout') });
        this.changeLayoutButton = page.getByRole('button', { name: translate('administration:landingPage:layout.changeLayout') });
        this.editInDesignerButton = page.getByRole('button', { name: translate('administration:landingPage:layout.editInDesigner') });
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
