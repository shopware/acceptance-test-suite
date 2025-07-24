import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Dashboard implements PageObject {

    public readonly contentView: Locator;

    public readonly adminMenuView: Locator;
    public readonly adminMenuCatalog: Locator;
    public readonly adminMenuOrder: Locator;
    public readonly adminMenuCustomer: Locator;
    public readonly adminMenuContent: Locator;
    public readonly adminMenuMarketing: Locator;
    public readonly adminMenuExtension: Locator;
    public readonly adminMenuUserChevron: Locator;
    public readonly adminMenuUserIcon: Locator;
    public readonly adminMenuUserName: Locator;

    public readonly welcomeHeadline: Locator;
    public readonly welcomeMessage: Locator;

    public readonly dataSharingConsentBanner: Locator;
    public readonly dataSharingAgreeButton: Locator;
    public readonly dataSharingNotAtTheMomentButton: Locator;
    public readonly dataSharingTermsAgreementLabel: Locator;
    public readonly dataSharingSettingsLink: Locator;
    public readonly dataSharingAcceptMessageText: Locator;
    public readonly dataSharingNotAtTheMomentMessageText: Locator;

    public readonly statisticsDateRange: Locator;
    public readonly statisticsChart: Locator;


    constructor(public readonly page: Page) {
        this.adminMenuView = page.locator('.sw-admin-menu');
        this.contentView = page.locator('.sw-desktop__content');
        this.adminMenuCatalog = page.locator('.sw-catalogue');
        this.adminMenuOrder = page.locator('.sw-order');
        this.adminMenuCustomer = page.locator('.sw-customer');
        this.adminMenuContent =  page.locator('.sw-content');
        this.adminMenuMarketing = page.locator('.sw-marketing');
        this.adminMenuExtension = page.locator('.sw-extension');
        this.adminMenuUserChevron = page.locator('.sw-admin-menu__user-actions-indicator');
        this.adminMenuUserIcon = page.locator('.sw-avatar');
        this.adminMenuUserName = page.locator('.sw-admin-menu__user-name');
        this.welcomeHeadline = page.locator('h1.sw-dashboard-index__welcome-title');
        this.welcomeMessage = page.locator('.sw-dashboard-index__welcome-message');
        this.dataSharingConsentBanner = page.locator('.sw-usage-data-consent-banner');
        this.dataSharingAgreeButton = page.getByRole('button', { name: 'Agree' });
        this.dataSharingNotAtTheMomentButton = page.getByRole('button', { name: 'Not at the moment' });
        this.dataSharingSettingsLink = page.locator('.sw-usage-data-consent-banner-reject-accept-message').getByRole('link');
        this.dataSharingAcceptMessageText = page.getByText('Thank you for your participation!');
        this.dataSharingNotAtTheMomentMessageText = page.getByText('You can at any time enter into the agreement and thus contribute to and profit from the constant evolution of our services');
        this.dataSharingTermsAgreementLabel = page.getByText('By clicking "Agree", you confirm that you are authorized to enter into this agreement on behalf of your company.');
        this.statisticsDateRange = page.locator('.mt-card__subtitle');
        this.statisticsChart = page.locator('.vue-apexcharts');
    }

    url() {
        return '#/sw/dashboard/index';
    }
}