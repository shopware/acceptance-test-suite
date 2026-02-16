import type { Locator, Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

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

        this.consentModal = page.getByRole('dialog').filter({ has: page.getByRole('heading', { name: 'Help us improve' } ) });

        this.shareAllButton = this.consentModal.getByRole('button', { name: 'Share all' });
        this.shareNothingButton = this.consentModal.getByRole('button', { name: 'Share nothing' });
        this.savePreferencesButton = this.consentModal.getByRole('button', { name: 'Save preferences' });

        this.shareStoreDataHeadline = this.consentModal.getByRole('heading', { name: 'Store data' });
        this.shareStoreDataText = this.consentModal.getByText('Combined data from orders, diagnostics, and store data helps us improve features. Please confirm you’re authorized to give consent for your company.');
        this.shareStoreDataCheckbox = this.consentModal.getByRole('checkbox', { name: 'Share store data' });

        this.shareUserTrackingDataHeadline = this.consentModal.getByRole('heading', { name: 'My data' });
        this.shareUserTrackingDataText = this.consentModal.getByText('We use data about how you interact with the Administration to improve its usability and performance.');
        this.shareUserTrackingDataCheckbox = this.consentModal.getByRole('checkbox', { name: 'Share my data' });

        this.dataUseDetailsLink = this.consentModal.getByRole('link', { name: 'shopware.com/en/data-use-details' });
        this.privacyPolicyLink = this.consentModal.getByRole('link', { name: 'Privacy Policy' });
    }

    url() {
        return new Error('Method not implemented, because it is a modal which can not be routed.').message;
    }
}
