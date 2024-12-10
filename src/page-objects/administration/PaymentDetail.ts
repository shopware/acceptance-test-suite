import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class PaymentDetail implements PageObject {

    public readonly header: Locator;
    public readonly nameField: Locator;
    public readonly availabilityRuleField: Locator;
    public readonly availabilityRuleListItem: Locator;


    constructor(public readonly page: Page) {
        this.header = page.locator('.smart-bar__header');
        this.nameField = page.getByLabel('Name',{exact: true});
        this.availabilityRuleField = page.locator('.sw-settings-payment-detail__field-availability-rule').locator('.sw-entity-single-select__selection-text');
        this.availabilityRuleListItem = page.locator('.sw-select-result-list__content').getByRole('listitem');
    }

    url(paymentId: string) {
        return `#/sw/settings/payment/detail/${paymentId}`;
    }

    getRuleSelectionCheckmark(ruleName: string) {
        return this.availabilityRuleListItem.filter({hasText: ruleName}).getByTestId('sw-icon__regular-checkmark-xs');
    }
}