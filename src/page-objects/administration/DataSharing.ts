import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class DataSharing implements PageObject {

    public readonly dataConsentHeadline: Locator;

    public readonly dataSharingSuccessMessageLabel: Locator;
    public readonly dataSharingAgreeButton: Locator;
    public readonly dataSharingDisableButton: Locator;
    public readonly dataSharingTermsAgreementLabel: Locator;

    constructor(public readonly page: Page) {
        this.dataConsentHeadline = page.locator('h3.sw-usage-data-consent-banner__content-headline');
        this.dataSharingAgreeButton = page.getByRole('button', { name: 'Agree' });
        this.dataSharingDisableButton = page.getByRole('button', { name: 'Disable data sharing' });
        this.dataSharingSuccessMessageLabel = page.getByText('You are sharing data with us', { exact: true });
        this.dataSharingTermsAgreementLabel = page.getByText('By clicking "Agree", you confirm that you are authorized to enter into this agreement on behalf of your company.');
    }

    url() {
        return '#/sw/settings/usage/data/index/general';
    }
}