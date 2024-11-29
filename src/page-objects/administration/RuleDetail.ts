import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class RuleDetail implements PageObject {

    // General tab
    public readonly nameInput: Locator;
    public readonly priorityInput: Locator;
    public readonly conditionTypeSelectionInput: Locator;
    public readonly conditionValueSelectionInput: Locator;
    public readonly filtersResultPopoverSelectionList: Locator;

    // Assignments tab
    public readonly shippingMethodCard: Locator;
    public readonly taxProviderCard: Locator;
    public readonly paymentMethodCard: Locator;
    public readonly promotionOrderRuleCard: Locator;
    public readonly promotionCustomerRuleCard: Locator;
    public readonly promotionCartRuleCard: Locator;

    constructor(public readonly page: Page) {
        this.nameInput = page.getByLabel('Name');
        this.priorityInput = page.getByLabel('Priority');
        this.conditionTypeSelectionInput = page.locator('.sw-condition-type-select').locator('.sw-single-select__selection');
        this.conditionValueSelectionInput = page.locator('.sw-condition__value-content').locator('.sw-entity-single-select__selection');
        this.filtersResultPopoverSelectionList = page.locator('.sw-select-result-list__content').getByRole('listitem');
        this.shippingMethodCard = page.locator('.sw-settings-rule-detail-assignments__card-shipping_method_availability_rule');
        this.taxProviderCard = page.locator('.sw-settings-rule-detail-assignments__card-tax_provider');
        this.paymentMethodCard = page.locator('.sw-settings-rule-detail-assignments__card-payment_method');
        this.promotionOrderRuleCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_order_rule');
        this.promotionCustomerRuleCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_customer_rule');
        this.promotionCartRuleCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_cart_rule');
    }

    async getRuleCardContent(ruleCard: Locator): Promise<Record<string, Locator>> {
        return {
            addAssignmentButton: ruleCard.getByText('Add assignment'),
        }
    }

    url(ruleId: string, tabName = 'base') {
        return `#/sw/settings/rule/detail/${ruleId}/${tabName}`
    }

}