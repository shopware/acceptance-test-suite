import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";

export class ThemesListing implements PageObject {
    public readonly contentView: Locator;
    public readonly page: Page;
    public readonly installedTheme: (title: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.contentView = page.locator(".sw-desktop__content");
        this.installedTheme = (title: string) => page.locator(".sw-theme-list-item__info", { hasText: title });
    }

    url() {
        return "#/sw/theme/manager/index";
    }
}
