import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { RuleCreate } from './RuleCreate';

export class RuleDetail extends RuleCreate implements PageObject {

    public readonly shippingMethodAvailabilityRulesCard: Locator;
    public readonly shippingMethodAvailabilityRulesCardLink: Locator;
    public readonly shippingMethodAvailabilityRulesCardTable: Locator;
    public readonly shippingMethodAvailabilityRulesCardEmptyState: Locator;
    public readonly shippingMethodAvailabilityRulesCardSearchField: Locator;
    public readonly taxProviderRulesCard: Locator;
    public readonly taxProviderRulesCardEmptyState: Locator;
    public readonly paymentMethodsAvailabilityRulesCard: Locator;
    public readonly paymentMethodsAvailabilityRulesCardEmptyState: Locator;
    public readonly paymentMethodsAvailabilityRulesCardLink: Locator;
    public readonly promotionOrderRulesCard: Locator;
    public readonly promotionOrderRulesCardEmptyState: Locator;
    public readonly promotionCustomerRulesCard: Locator;
    public readonly promotionCustomerRulesCardEmptyState: Locator;
    public readonly promotionCartRulesCard: Locator;
    public readonly promotionCartRulesCardEmptyState: Locator;

    constructor(public readonly page: Page) {
        super(page);
        this.shippingMethodAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardLink = this.shippingMethodAvailabilityRulesCard.getByRole('link');
        this.shippingMethodAvailabilityRulesCardTable = page.locator('.sw-settings-rule-detail-assignments__entity-listing-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardEmptyState = this.shippingMethodAvailabilityRulesCard.getByRole('alert');
        this.shippingMethodAvailabilityRulesCardSearchField = this.shippingMethodAvailabilityRulesCard.getByPlaceholder('Search...');
        this.taxProviderRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-tax_provider');
        this.taxProviderRulesCardEmptyState = this.taxProviderRulesCard.getByRole('alert');
        this.paymentMethodsAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-payment_method');
        this.paymentMethodsAvailabilityRulesCardEmptyState = this.paymentMethodsAvailabilityRulesCard.getByRole('alert');
        this.paymentMethodsAvailabilityRulesCardLink = page.locator('.sw-settings-rule-detail-assignments__card-payment_method').getByRole('link');
        this.promotionOrderRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_order_rule');
        this.promotionOrderRulesCardEmptyState = this.promotionOrderRulesCard.getByRole('alert');
        this.promotionCustomerRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_customer_rule');
        this.promotionCustomerRulesCardEmptyState = this.promotionCustomerRulesCard.getByRole('alert');
        this.promotionCartRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_cart_rule');
        this.promotionCartRulesCardEmptyState = this.promotionCartRulesCard.getByRole('alert');
    }

    async getEntityCard(cardLocator: Locator): Promise<Record<string, Locator>> {
        return {
            addAssignmentButton: cardLocator.getByText('Add assignment'),
        }
    }

    url(ruleId?: string, tabName = 'base') {
        return `#/sw/settings/rule/detail/${ruleId}/${tabName}`
    }
}