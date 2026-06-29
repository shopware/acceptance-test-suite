import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class CustomerGroupListing implements PageObject {
    public readonly headline: Locator;
    public readonly addCustomerGroupButton: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole("heading", { name: translate("administration:customerGroup:listing.customerGroups") });
        this.addCustomerGroupButton = page.locator(".sw-settings-customer-group-list__create");
    }

    async getCustomerGroupByName(customerGroup: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.getByRole("row").filter({ hasText: customerGroup });
        const customerGroupCheckbox = lineItem.locator(".sw-data-grid__cell--selection");
        const customerGroupName = lineItem.locator(".sw-data-grid__cell--name");
        const customerGroupTaxDisplay = lineItem.locator(".sw-data-grid__cell--displayGross");
        const customerGroupActionButton = lineItem.locator(".sw-data-grid__actions-menu");

        return {
            customerGroupCheckbox: customerGroupCheckbox,
            customerGroupName: customerGroupName,
            customerGroupTaxDisplay: customerGroupTaxDisplay,
            customerGroupActionButton: customerGroupActionButton,
        };
    }

    url(searchTerms: string[] = [], page = 1) {
        let url = "#/sw/settings/customer/group/index";

        if (searchTerms.length > 0) {
            const term = searchTerms.join("+");
            url += `?limit=25&page=${page}&term=${encodeURIComponent(term)}`;
        }

        return url;
    }
}
