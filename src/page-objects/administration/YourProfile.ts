import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class YourProfile implements PageObject {
    public readonly contentView: Locator;
    public readonly page: Page;
    public readonly searchPreferencesTab: Locator;
    public readonly firstNameField: Locator;
    public readonly lastNameField: Locator;
    public readonly userNameField: Locator;
    public readonly emailField: Locator;
    public readonly deselectAllButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator('.sw-desktop__content');
        this.searchPreferencesTab = page.locator('.sw-tabs-item').filter({ hasText: translate('administration:yourProfile:tabs.searchPreferences') });
        this.firstNameField = page.getByRole('textbox', { name: translate('administration:yourProfile:fields.firstName') });
        this.lastNameField = page.getByRole('textbox', { name: translate('administration:yourProfile:fields.lastName') });
        this.userNameField = page.getByRole('textbox', { name: translate('administration:yourProfile:fields.username') });
        this.emailField = page.getByRole('textbox', { name: translate('administration:yourProfile:fields.email') });
        this.deselectAllButton = page.getByRole('button', { name: translate('administration:yourProfile:buttons.deselectAll') });
    }

    url() {
        return '#/sw/profile/index/general';
    }
}
