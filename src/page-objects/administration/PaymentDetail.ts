import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class PaymentDetail implements PageObject {
    public readonly header: Locator;
    public readonly nameField: Locator;
    public readonly availabilityRuleField: Locator;
    public readonly availabilityRuleListItem: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator(".smart-bar__header");
        this.nameField = page.getByLabel(translate("administration:payment:common.name"), { exact: true });
        this.availabilityRuleField = page.locator(".sw-settings-payment-detail__field-availability-rule").locator(".sw-entity-single-select__selection-text");
        this.availabilityRuleListItem = page.locator(".sw-select-result-list__content").getByRole("listitem");
    }

    url(paymentId: string) {
        return `#/sw/settings/payment/detail/${paymentId}`;
    }

    getRuleSelectionCheckmark(ruleName: string) {
        return this.availabilityRuleListItem.filter({ hasText: ruleName }).getByTestId("sw-icon__regular-checkmark-xs");
    }
}
