import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class AdminLandingPageCreate implements PageObject {

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
    public readonly assignLayoutButton: Locator;
    public readonly searchLayoutInput: Locator;
    public readonly layoutItems: Locator;
    public readonly layoutSaveButton: Locator;
    public readonly layoutEmptyState: Locator;
    public readonly createNewLayoutButton: Locator;

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
        const layoutCardPreview = page.locator('.sw-category-layout-card__preview');
        this.layoutEmptyState = layoutCardPreview.locator('.is--empty');
        this.assignLayoutButton = page.getByRole('button', {name: 'Assign layout'});
        this.createNewLayoutButton = page.getByRole('button', {name: 'Create new layout'});
        const layoutModal = page.getByRole('dialog', { name: 'Select layout' });
        this.searchLayoutInput = page.getByPlaceholder('Search layouts...');
        this.layoutItems = layoutModal.locator('.sw-cms-list-item');
        this.layoutSaveButton = layoutModal.getByRole('button', { name: 'Save' });
    }

    url() {
        return `#/sw/category/landingPage/create/base`;
    }
}
