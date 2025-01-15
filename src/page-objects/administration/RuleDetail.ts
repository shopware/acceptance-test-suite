import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { RuleCreate } from './RuleCreate';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

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
    public readonly assignmentModalAddButton: Locator;
    public readonly assignmentModalSearchField: Locator;


    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page);
        this.shippingMethodAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardLink = this.shippingMethodAvailabilityRulesCard.getByRole('link');
        this.shippingMethodAvailabilityRulesCardTable = page.locator('.sw-settings-rule-detail-assignments__entity-listing-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardEmptyState = this.shippingMethodAvailabilityRulesCard.getByRole('alert');
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
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.assignmentModalSearchField = page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...');
            this.assignmentModalAddButton = page.locator('.sw-button--primary').getByText('Add');
            this.shippingMethodAvailabilityRulesCardSearchField = this.shippingMethodAvailabilityRulesCard.getByPlaceholder('Search...');
        } else {
            this.assignmentModalSearchField = page.locator('.sw-settings-rule-add-assignment-modal').getByRole('textbox');
            this.assignmentModalAddButton = page.locator('.mt-button--primary').getByText('Add');
            this.shippingMethodAvailabilityRulesCardSearchField = this.shippingMethodAvailabilityRulesCard.getByRole('textbox');
        }
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