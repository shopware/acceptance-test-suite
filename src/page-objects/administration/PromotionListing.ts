import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class PromotionsListing implements PageObject {

    // SmartBar
    public readonly smartBar: Locator;
    public readonly smartBarHeader: Locator;
    public readonly languageSelect: Locator;
    public readonly smartBarAddPromotionButton: Locator;

    // Empty state locators
    public readonly emptyState: Locator;
    public readonly emptyStateAddPromotionButton: Locator;

    // Promotions table locators
    public readonly promotionsTable: Locator;

    // Sidebar
    public readonly sidebarRefreshButton: Locator;

    constructor(public readonly page: Page) {
        this.smartBar = page.locator('.smart-bar__content');
        this.smartBarHeader = this.smartBar.locator('.smart-bar__header');
        this.languageSelect = this.smartBar.locator('.sw-entity-single-select__selection');
        this.smartBarAddPromotionButton = this.smartBar.getByRole('button', {name: 'Add promotion'} );

        // Empty state locators
        this.emptyState = page.locator('.sw-promotion-v2-empty-state-hero');
        this.emptyStateAddPromotionButton = this.emptyState.getByRole('button', {name: 'Add promotion'} );

        // Promotions table locators
        this.promotionsTable = page.locator('.sw-data-grid__table');

        // Sidebar
        this.sidebarRefreshButton = page.getByTitle('Refresh');
    }

    /**
     * Returns the url to the listing page.
     *
     * @param searchTerms - Includes search terms for filtering of the promotions list.
     */
    url(searchTerms: string[] = []) {
        let url = '#/sw/promotion/v2/index';
        if (searchTerms.length > 0) {
            let tempTerm = '';
            for (const searchTerm of searchTerms) {
                if (tempTerm != '') {
                    tempTerm += '+';
                } 
                tempTerm += searchTerm;
            } 
            url += `?limit=25&page=1&term=${tempTerm}`;
        } 
        return url;
    }

    /**
     * Returns the table row containing the promotion with the given promotion name.
     *
     * @param promotionName - Promotion name you are looking for.
     */
    async getPromotionRow(promotionName: string): Promise<Record<string, Locator>> {
        const promotionTableRow = this.promotionsTable.locator('.sw-data-grid__row', { hasText: promotionName });
        const promotionNameSelector = '.sw-data-grid__cell--name';
        const promotionValidFromSelector = '.sw-data-grid__cell--validFrom';
        const promotionValidUntilSelector = '.sw-data-grid__cell--validUntil';
        const promotionActiveSelector = '.is--active';
        const promotionInactiveSelector = '.is--inactive';
        const promotionContextButtonSelector = '.sw-context-button';
        const promotionContextMenuSelector = '.sw-context-menu';

        return {
            selectionCheckbox: promotionTableRow.getByRole('checkbox'),
            promotionName: promotionTableRow.locator(promotionNameSelector),
            promotionActive: promotionTableRow.locator(promotionActiveSelector),
            promotionInactive: promotionTableRow.locator(promotionInactiveSelector),
            promotionValidFrom: promotionTableRow.locator(promotionValidFromSelector),
            promotionValidUntil: promotionTableRow.locator(promotionValidUntilSelector),
            promotionContextButton: promotionTableRow.locator(promotionContextButtonSelector),
            promotionContextMenuEditButton: this.page.locator(promotionContextMenuSelector).getByRole('link', { name: 'Edit' }),
            promotionContextMenuDuplicateButton: this.page.locator(promotionContextMenuSelector).getByRole('button', { name: 'Duplicate' }),
            promotionContextMenuDeleteButton: this.page.locator(promotionContextMenuSelector).getByRole('button', { name: 'Delete' }),
        };
    }
} 