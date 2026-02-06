import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class RuleListing implements PageObject {
    public readonly createRuleButton: Locator;
    public readonly header: Locator;
    public readonly grid: Locator;
    public readonly page: Page;
    public readonly gridCell: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createRuleButton = page.getByText(translate("administration:rule:buttons.createRule"));
        this.header = page.locator(".smart-bar__header");
        this.grid = page.locator(".sw-data-grid__table)");
        this.gridCell = page.locator(".sw-data-grid__cell--name");
    }

    url(searchTerm: string) {
        let url = "#/sw/settings/rule/index";
        if (searchTerm.length > 0) {
            url += `?limit=25&page=1&term=${searchTerm}`;
        }
        return url;
    }
}
