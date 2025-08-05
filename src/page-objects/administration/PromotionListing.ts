import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class PromotionsListing implements PageObject {

    private readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

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

    constructor(public readonly page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.instanceMeta = instanceMeta;
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

        // Selectors specific for versions before 6.7
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.smartBarAddPromotionButton = this.smartBar.getByRole('link', { name: 'Add promotion' } );
            this.emptyStateAddPromotionButton = this.emptyState.getByRole('link', {name: 'Add promotion'} );
        }
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
        const selectionCheckbox = promotionTableRow.getByRole('checkbox');
        const promotionNameCell = promotionTableRow.locator('.sw-data-grid__cell--name');
        const promotionValidFrom = promotionTableRow.locator('.sw-data-grid__cell--validFrom');
        const promotionValidUntil = promotionTableRow.locator('.sw-data-grid__cell--validUntil');
        const promotionActive = promotionTableRow.locator('.is--active');
        const promotionInactive = promotionTableRow.locator('.is--inactive');
        const promotionContextButton = promotionTableRow.locator('.sw-context-button');
        const promotionContextMenu = '.sw-context-menu';
        const promotionContextMenuEdit = this.page.locator(promotionContextMenu).getByRole('link', { name: 'Edit' });
        let promotionContextMenuDuplicate = this.page.locator(promotionContextMenu).getByRole('button', { name: 'Duplicate' });
        let promotionContextMenuDelete = this.page.locator(promotionContextMenu).getByRole('button', { name: 'Delete' });

        // Selectors specific for versions before 6.7.1
        if (satisfies(this.instanceMeta.version, '<6.7.1')) {
            promotionContextMenuDuplicate = this.page.locator(promotionContextMenu).locator('.sw-context-menu-item', { hasText: 'Duplicate' });
            promotionContextMenuDelete = this.page.locator(promotionContextMenu).locator('.sw-context-menu-item', { hasText: 'Delete' });
        }

        return {
            selectionCheckbox: selectionCheckbox,
            promotionName: promotionNameCell,
            promotionActive: promotionActive,
            promotionInactive: promotionInactive,
            promotionValidFrom: promotionValidFrom,
            promotionValidUntil: promotionValidUntil,
            promotionContextButton: promotionContextButton,
            promotionContextMenuEditButton: promotionContextMenuEdit,
            promotionContextMenuDuplicateButton: promotionContextMenuDuplicate,
            promotionContextMenuDeleteButton: promotionContextMenuDelete,
        };
    }
} 