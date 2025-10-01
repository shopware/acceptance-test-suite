import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class Install implements PageObject {
    readonly page: Page;

    // Welcome Screen
    readonly welcomeHeading: Locator;
    readonly languageDropdown: Locator;
    readonly welcomeNextLink: Locator;

    // System Requirements
    readonly systemRequirementsHeading: Locator;
    readonly systemReadyHeading: Locator;
    readonly systemNextButton: Locator;

    // License Terms
    readonly licenseHeading: Locator;
    readonly termsCheckbox: Locator;
    readonly licenseNextButton: Locator;

    // Database Configuration
    readonly databaseHeading: Locator;
    readonly serverField: Locator;
    readonly userField: Locator;
    readonly passwordField: Locator;
    readonly newDatabaseCheckbox: Locator;
    readonly databaseNameField: Locator;
    readonly startInstallationButton: Locator;

    // Installation Progress
    readonly installationHeading: Locator;
    readonly installationCompleteHeading: Locator;
    readonly installationNextLink: Locator;

    // Configuration
    readonly configurationHeading: Locator;
    readonly shopNameField: Locator;
    readonly shopEmailField: Locator;
    readonly defaultLanguageField: Locator;
    readonly defaultCurrencyField: Locator;
    readonly defaultCountryField: Locator;
    readonly englishLanguageCheckbox: Locator;
    readonly dollarCurrencyCheckbox: Locator;
    readonly adminEmailField: Locator;
    readonly adminFirstNameField: Locator;
    readonly adminLastNameField: Locator;
    readonly adminLoginField: Locator;
    readonly adminPasswordField: Locator;
    readonly configurationNextButton: Locator;

    // Languages Download
    readonly languagesDownloadHeading: Locator;

    // Finish
    readonly installationCompletedHeading: Locator;
    readonly continueToShopLink: Locator;

    // Admin Dashboard
    readonly dashboardHeading: Locator;

    // Settings - Languages
    readonly settingsLanguagesHeading: Locator;
    readonly languagesCount: Locator;
    readonly englishDefaultRow: Locator;

    // Settings - Snippets
    readonly settingsSnippetsHeading: Locator;
    readonly baseEnUsRow: Locator;

    constructor(page: Page) {
        this.page = page;

        // Welcome Screen
        this.welcomeHeading = page.getByRole('heading', { name: 'Welcome to Shopware 6', level: 1 });
        this.languageDropdown = page.getByLabel('Installation wizard language');
        this.welcomeNextLink = page.getByRole('link', { name: 'Next' });

        // System Requirements
        this.systemRequirementsHeading = page.getByRole('heading', { name: 'System requirements', level: 2 });
        this.systemReadyHeading = page.getByRole('heading', { name: 'Your system is ready for Shopware 6', level: 3 });
        this.systemNextButton = page.getByRole('button', { name: 'Next' });

        // License Terms
        this.licenseHeading = page.getByRole('heading', { name: 'General Terms and Conditions of Business ("GTC")', level: 2 });
        this.termsCheckbox = page.getByText('I agree to the General Terms and Conditions of Business (GTC)');
        this.licenseNextButton = page.getByRole('button', { name: 'Next' });

        // Database Configuration
        this.databaseHeading = page.getByRole('heading', { name: 'Configure database', level: 2 });
        this.serverField = page.getByLabel('Server:');
        this.userField = page.getByLabel('User:');
        this.passwordField = page.getByLabel('Password:');
        this.newDatabaseCheckbox = page.getByText('New database:');
        this.databaseNameField = page.locator('#databaseName_new');
        this.startInstallationButton = page.getByRole('button', { name: 'Start installation' });

        // Installation Progress
        this.installationHeading = page.getByRole('heading', { name: 'Installation', level: 2 });
        this.installationCompleteHeading = page.getByRole('heading', { name: 'Shopware 6 has been installed!', level: 3 });
        this.installationNextLink = page.getByRole('link', { name: 'Next' });

        // Configuration
        this.configurationHeading = page.getByRole('heading', { name: 'Configuration', level: 2 });
        this.shopNameField = page.getByLabel('Shop name');
        this.shopEmailField = page.getByLabel('Shop email address:');
        this.defaultLanguageField = page.getByLabel('Default system language:');
        this.defaultCurrencyField = page.getByLabel('Default currency:');
        this.defaultCountryField = page.getByLabel('Default country:');
        this.englishLanguageCheckbox = page.getByRole('checkbox', { name: 'English (United States of America)' });
        this.dollarCurrencyCheckbox = page.getByRole('checkbox', { name: 'Dollar (US)' });
        this.adminEmailField = page.getByLabel('Admin email:');
        this.adminFirstNameField = page.getByLabel('Admin first name:');
        this.adminLastNameField = page.getByLabel('Admin last name:');
        this.adminLoginField = page.getByLabel('Admin login name:');
        this.adminPasswordField = page.getByLabel('Admin password:');
        this.configurationNextButton = page.getByRole('button', { name: 'Next' });

        // Languages Download
        this.languagesDownloadHeading = page.getByRole('heading', { name: 'Languages Download', level: 2 });

        // Finish
        this.installationCompletedHeading = page.getByRole('heading', { name: 'Installation completed', level: 2 });
        this.continueToShopLink = page.getByRole('link', { name: 'Continue to shop' });

        // Admin Dashboard
        this.dashboardHeading = page.getByRole('heading', { name: 'Introducing Shopware Services', level: 3 });

        // Settings - Languages
        this.settingsLanguagesHeading = page.getByRole('heading', { name: 'Settings Languages', level: 2 });
        this.languagesCount = page.getByText('Languages (3)');
        this.englishDefaultRow = page.getByRole('row', { name: 'English (US) Default' }).locator('#meteor-icon-kit__regular-checkmark-xs');

        // Settings - Snippets
        this.settingsSnippetsHeading = page.getByRole('heading', { name: 'Settings Snippets', level: 2 });
        this.baseEnUsRow = page.getByRole('row', { name: 'BASE en-US' });
    }

    url() {
        return `${process.env.APP_URL}installer`;
    }

    async gotoAdminLanguages(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL}admin#/sw/settings/language/index`, { waitUntil: 'commit' });
    }

    async gotoAdminSnippets(): Promise<void> {
        await this.page.goto(`${process.env.APP_URL}admin#/sw/settings/snippet/index`, { waitUntil: 'commit' });
    }

    async waitForInstallationComplete(): Promise<void> {
        await this.page.waitForURL(`${process.env.APP_URL}installer/database-import`, { waitUntil: 'networkidle' });
    }

    async waitForFinishPage(): Promise<void> {
        await this.page.waitForURL(`${process.env.APP_URL}installer/finish?completed=1`, { waitUntil: 'commit' });
    }

    async waitForAdminDashboard(): Promise<void> {
        await this.page.waitForURL(`${process.env.APP_URL}admin#/sw/dashboard/index`, { waitUntil: 'commit' });
    }
}
