import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class PromotionCreate implements PageObject {

    public readonly page: Page;

    // SmartBar
    public readonly smartBar: Locator;
    public readonly smartBarHeader: Locator;
    public readonly languageSelect: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;

    // General
    public readonly generalCard: Locator;
    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;

    constructor(page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;

        // SmartBar
        this.smartBar = page.locator('.smart-bar__content');
        this.smartBarHeader = this.smartBar.locator('.smart-bar__header');
        this.languageSelect = this.smartBar.locator('.sw-entity-single-select__selection');
        this.saveButton = this.smartBar.getByRole('button', { name: 'Save' });
        this.cancelButton = this.smartBar.getByRole('button', { name: 'Cancel' });

        // General
        this.generalCard = page.locator('.sw-promotion-v2-detail-base__card-general');
        this.nameInput = this.generalCard.locator('.sw-promotion-v2-detail-base__field-name').getByRole('textbox');
        this.priorityInput = this.generalCard.getByLabel('Priority');
    }

    /**
     * Returns the url to the creation page.
     */
    url() {
        return '#/sw/promotion/v2/create/base';
    }
}  