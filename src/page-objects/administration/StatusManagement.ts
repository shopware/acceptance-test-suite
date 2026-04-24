import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class StatusManagement implements PageObject {
    public readonly header: Locator;
    public readonly stateMachineGrid: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator(".smart-bar__header h2").filter({ hasText: translate("administration:settings:links.statusManagement") });
        this.stateMachineGrid = page.locator(".sw-data-grid");
    }

    url() {
        return "#/sw/settings/state/machine/index";
    }
}
