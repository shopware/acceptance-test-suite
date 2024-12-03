import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { RuleCreate } from './RuleCreate';

export class RuleDetail extends RuleCreate implements PageObject {

    // Assignments tab
    public readonly shippingMethodCard: Locator;
    public readonly taxProviderCard: Locator;
    public readonly paymentMethodCard: Locator;
    public readonly promotionOrderRuleCard: Locator;
    public readonly promotionCustomerRuleCard: Locator;
    public readonly promotionCartRuleCard: Locator;

    constructor(public readonly page: Page) {
        super(page);
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

    url(ruleId?: string, tabName = 'base') {
        return `#/sw/settings/rule/detail/${ruleId}/${tabName}`
    }

}