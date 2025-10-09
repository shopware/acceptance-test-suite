import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class FlowBuilderListing implements PageObject {
    public readonly page: Page;
    public readonly contentView: Locator;
    public readonly createFlowButton: Locator;
    public readonly firstFlowName: Locator;
    public readonly firstFlowContextButton: Locator;
    public readonly flowContextMenu: Locator;
    public readonly contextMenuDownload: Locator;
    public readonly contextMenuDuplicate: Locator;
    public readonly contextMenuEdit: Locator;
    public readonly contextMenuDelete: Locator;
    public readonly flowDownloadModal: Locator;
    public readonly downloadFlowButton: Locator;
    public readonly flowDeleteButton: Locator;
    public readonly successAlert: Locator;
    public readonly successAlertMessage: Locator;
    public readonly searchBar: Locator;
    public readonly pagination: Locator;
    public readonly testFlowNameCells: Locator;
    public readonly flowTemplatesTab: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator('.sw-desktop__content');
        this.createFlowButton = page.locator('.sw-flow-list__create');
        this.firstFlowName = page.locator('.sw-data-grid__cell--name a').first();
        this.firstFlowContextButton = page.locator('.sw-data-grid__actions-menu').first();
        this.flowContextMenu = page.locator('.sw-context-menu__content');
        this.contextMenuDownload = this.flowContextMenu.locator('.sw-flow-list__item-download');
        this.contextMenuDuplicate = this.flowContextMenu.locator('.sw-flow-list__item-duplicate');
        this.contextMenuEdit = this.flowContextMenu.locator('.sw-flow-list__item-edit');
        this.contextMenuDelete = this.flowContextMenu.locator('.sw-flow-list__item-delete');
        this.flowDownloadModal = page.locator('.sw-flow-download-modal');
        this.flowDeleteButton = page
            .getByRole('dialog')
            .filter({ hasText: translate('administration:flowBuilder:messages.deleteConfirmation') })
            .getByRole('button', { name: translate('administration:flowBuilder:listing.delete') });
        this.downloadFlowButton = page.getByRole('button', { name: translate('administration:flowBuilder:listing.downloadFlow') });
        this.successAlert = page.locator('.sw-alert__body');
        this.successAlertMessage = page.locator('.sw-alert__message');
        this.searchBar = page.locator('.sw-search-bar__input');
        this.pagination = page.locator('.sw-pagination');
        this.testFlowNameCells = page.locator('.sw-data-grid__cell--name a').getByText(translate('administration:flowBuilder:listing.testFlow'));
        this.flowTemplatesTab = page.locator('.sw-tabs-item').getByText(translate('administration:flowBuilder:listing.flowTemplates'));
    }

    url(tabName = 'flows') {
        return `#/sw/flow/index/${tabName}`;
    }

    async getLineItemByFlowName(flowName: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.locator('.sw-data-grid__row').filter({ hasText: flowName });
        const flowSelectionCheckbox = lineItem.locator('.sw-data-grid__cell--selection').locator('.sw-field__checkbox');
        const flowActiveCheckmark = lineItem.locator('.sw-data-grid__cell--active').locator('.icon--regular-checkmark-xs');
        const flowDisabledCheckmark = lineItem.locator('.sw-data-grid__cell--active').locator('.icon--regular-times-s');
        const flowNameText = lineItem.locator('.sw-data-grid__cell--name');
        const flowEventNameText = lineItem.locator('.sw-data-grid__cell--eventName');
        const flowContextMenuButton = lineItem.locator('.sw-data-grid__actions-menu');
        return {
            flowSelectionCheckbox: flowSelectionCheckbox,
            flowActiveCheckmark: flowActiveCheckmark,
            flowDisabledCheckmark: flowDisabledCheckmark,
            flowNameText: flowNameText,
            flowEventNameText: flowEventNameText,
            flowContextMenuButton: flowContextMenuButton,
        };
    }
}
