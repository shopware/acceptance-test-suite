import type { Locator, Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class DataSharingConsentModal implements PageObject {

    public readonly page: Page;
    public readonly consentModal: Locator;
    public readonly shareAllButton: Locator;
    public readonly shareNothingButton: Locator;
    public readonly savePreferencesButton: Locator;
    public readonly shareStoreDataHeadline: Locator;
    public readonly shareStoreDataText: Locator;
    public readonly shareStoreDataCheckbox: Locator;
    public readonly shareUserTrackingDataHeadline: Locator;
    public readonly shareUserTrackingDataText: Locator;
    public readonly shareUserTrackingDataCheckbox: Locator;
    public readonly dataUseDetailsLink: Locator;
    public readonly privacyPolicyLink: Locator;

    constructor(page: Page) {
        this.page = page;

        this.consentModal = page.getByRole('dialog', { name: 'Help us improve' });

        this.shareAllButton = page.getByRole('button', { name: 'Share all' });
        this.shareNothingButton = page.getByRole('button', { name: 'Share nothing' });
        this.savePreferencesButton = page.getByRole('button', { name: 'Save preferences' });

        this.shareStoreDataHeadline = page.getByRole('heading', { name: 'Store data' });
        this.shareStoreDataText = page.getByText('Combined data from orders, diagnostics, and store data helps us improve features. Please confirm you’re authorized to give consent for your company.');
        this.shareStoreDataCheckbox = page.getByRole('checkbox', { name: 'Share store data' });

        this.shareUserTrackingDataHeadline = page.getByRole('heading', { name: 'My data' });
        this.shareUserTrackingDataText = page.getByText('We use data about how you interact with the Administration to improve its usability and performance.');
        this.shareUserTrackingDataCheckbox = page.getByRole('checkbox', { name: 'Share my data' });

        this.dataUseDetailsLink = page.getByRole('link', { name: 'shopware.com/en/data-use-details' });
        this.privacyPolicyLink = page.getByRole('link', { name: 'Privacy Policy' });
    }

    url() {
        return new Error('Method not implemented, because it is a modal which can not be routed.').message;
    }
}
