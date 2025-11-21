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

        this.consentModal = page.getByRole('dialog', { name: translate('administration:dashboard:dataSharingModal.title') });

        this.shareAllButton = page.getByRole('button', { name: translate('administration:dashboard:dataSharingModal.shareAll') });
        this.shareNothingButton = page.getByRole('button', { name: translate('administration:dashboard:dataSharingModal.shareAll') });
        this.savePreferencesButton = page.getByRole('button', { name: translate('administration:dashboard:dataSharingModal.savePreferences') });

        this.shareStoreDataHeadline = page.getByRole('heading', { name: translate('administration:dashboard:dataSharingModal.shareStoreDataHeadline') });
        this.shareStoreDataText = page.getByText(translate('administration:dashboard:dataSharingModal.shareStoreDataText'));
        this.shareStoreDataCheckbox = page.getByRole('checkbox', { name: translate('administration:dashboard:dataSharingModal.shareStoreDataCheckbox') });

        this.shareUserTrackingDataHeadline = page.getByRole('heading', { name: translate('administration:dashboard:dataSharingModal.shareUserTrackingDataHeadline') });
        this.shareUserTrackingDataText = page.getByText(translate('administration:dashboard:dataSharingModal.shareUserTrackingDataText'));
        this.shareUserTrackingDataCheckbox = page.getByRole('checkbox', { name: translate('administration:dashboard:dataSharingModal.shareUserTrackingDataCheckbox') });

        this.dataUseDetailsLink = page.getByText(translate('administration:dashboard:dataSharingModal.dataUseDetailsLinkText'));
        this.privacyPolicyLink = page.getByText(translate('administration:dashboard:dataSharingModal.privacyPolicyLinkText'));

    }

    url() {
        return new Error('Method not implemented, because it is a modal which can not be routed.').message;
    }
}
