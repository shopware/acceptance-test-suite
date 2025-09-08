import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class ThemesDetail implements PageObject {

    public readonly contentView: Locator;
    public readonly page: Page;
    public readonly scrollableElement: Locator;
    public readonly themeCard: (headline: string) => Locator;
    public readonly sidebarButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator('.sw-page__content');
        this.scrollableElement = page.locator('.sw-page__main-content-inner')
        this.themeCard = (headline: string) => page.locator('.mt-card__header', { hasText: headline});
        this.sidebarButton = page.locator('.sw-sidebar-navigation-item').first();
    }
    
    url() {
        return '#/sw/theme/manager/index';
    }
}