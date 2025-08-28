import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class YourProfile implements PageObject {

    public readonly contentView: Locator;
    public readonly page: Page;
    public readonly searchPreferencesTab: Locator;
    public readonly firstNameField: Locator;
    public readonly lastNameField: Locator;
    public readonly userNameField: Locator;
    public readonly emailField: Locator;


    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator('.sw-desktop__content');
        this.searchPreferencesTab = page.locator('.sw-tabs-item').filter({ hasText: 'Search preferences' });
        this.firstNameField = page.getByRole('textbox', { name: 'First name' });
        this.lastNameField = page.getByRole('textbox', { name: 'Last name' });
        this.userNameField = page.getByRole('textbox', { name: 'Username' });
        this.emailField = page.getByRole('textbox', { name: 'Email' });

    }
    url() {
        return '#/sw/profile/index/general';
    }
}