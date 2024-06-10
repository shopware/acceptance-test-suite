import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Dashboard implements PageObject {

    public readonly welcomeHeadline: Locator;

    public readonly dataSharingConsentBanner: Locator;
    public readonly dataSharingAgreeButton: Locator;
    public readonly dataSharingNotAtTheMomentButton: Locator;
    public readonly dataSharingTermsAgreementLabel: Locator;
    public readonly dataSharingSettingsLink: Locator;
    public readonly dataSharingAcceptMessageText: Locator;
    public readonly dataSharingNotAtTheMomentMessageText: Locator;

    constructor(public readonly page: Page) {
        this.welcomeHeadline = page.locator('h1.sw-dashboard-index__welcome-title');
        this.dataSharingConsentBanner = page.locator('.sw-usage-data-consent-banner');
        this.dataSharingAgreeButton = page.getByRole('button', { name: 'Agree' });
        this.dataSharingNotAtTheMomentButton = page.getByRole('button', { name: 'Not at the moment' });
        this.dataSharingSettingsLink = page.locator('.sw-usage-data-consent-banner-reject-accept-message').getByRole('link');
        this.dataSharingAcceptMessageText = page.getByText('Thank you for your participation!');
        this.dataSharingNotAtTheMomentMessageText = page.getByText('You can at any time enter into the agreement and thus contribute to and profit from the constant evolution of our services');
        this.dataSharingTermsAgreementLabel = page.getByText('By clicking "Agree", you confirm that you are authorized to enter into this agreement on behalf of your company.');
    }

    url() {
        return '#/sw/dashboard/index';
    }
}