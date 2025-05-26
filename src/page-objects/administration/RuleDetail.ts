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
    public readonly conditionSelectField: Locator;
    public readonly conditionLineItemGoodsTotalOperator: Locator;
    public readonly conditionLineItemGoodsTotalValue: Locator;
    public readonly conditionDateRangeOperator: Locator;
    public readonly conditionDateRangeDateFieldFirst: Locator;
    public readonly conditionDateRangeDateFieldSecond: Locator;
    public readonly conditionCustomerSurnameOperator: Locator;
    public readonly conditionCustomerSurnameValue: Locator;
    public readonly conditionCartLineItemTaxationMatchOperator: Locator;
    public readonly conditionCartLineItemTaxationOperator: Locator;
    public readonly conditionCartLineItemTaxationValue: Locator;
    public readonly conditionTimeRangeValueFirst: Locator;
    public readonly conditionTimeRangeValueSecond: Locator;
    public readonly conditionOrderCreatedByAdminValue: Locator;
    public readonly conditionLineItemGoodsTotalFilter: Locator;
    public readonly conditionFilterModal: Locator;
    public readonly conditionCartLineItemInStockOperator: Locator;
    public readonly conditionCartLineItemInStockValue: Locator
    public readonly conditionFilterModalCloseButtonX: Locator;


    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
        this.shippingMethodAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardLink = this.shippingMethodAvailabilityRulesCard.getByRole('link');
        this.shippingMethodAvailabilityRulesCardTable = page.locator('.sw-settings-rule-detail-assignments__entity-listing-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardEmptyState = this.shippingMethodAvailabilityRulesCard.getByRole('alert');
        this.shippingMethodAvailabilityRulesCardSearchField = this.shippingMethodAvailabilityRulesCard.getByRole('textbox');
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
        this.assignmentModalSearchField = page.locator('.sw-settings-rule-add-assignment-modal').getByRole('textbox');
        this.conditionSelectField = page.locator('.sw-condition-tree').locator('.sw-condition-type-select');
        this.conditionLineItemGoodsTotalOperator = page.locator('.sw-condition-line-item-goods-total').locator('.sw-single-select__selection-text');
        this.conditionLineItemGoodsTotalValue = page.locator('.sw-condition-line-item-goods-total').getByRole('textbox');
        this.conditionLineItemGoodsTotalFilter = page.locator('.sw-condition-line-item-goods-total__filter').getByRole('button');
        this.conditionDateRangeOperator = page.locator('.sw-condition-date-range').locator('.sw-single-select__selection-text');
        this.conditionDateRangeDateFieldFirst = page.locator('.sw-condition-date-range').locator('.flatpickr-input').first();
        this.conditionDateRangeDateFieldSecond = page.locator('.sw-condition-date-range').locator('.flatpickr-input').last();
        this.conditionCustomerSurnameOperator = page.locator('.sw-condition__condition-type-customerLastName').locator('.sw-single-select__selection-text');
        this.conditionCustomerSurnameValue = page.locator('.sw-condition__condition-type-customerLastName').getByRole('textbox');
        this.conditionCartLineItemTaxationMatchOperator = page.locator('.sw-condition-base-line-item__matches-all');
        this.conditionCartLineItemTaxationOperator =page.locator('.sw-condition__condition-type-cartLineItemTaxation').locator('.sw-single-select__selection-text');
        this.conditionCartLineItemTaxationValue = page.locator('.sw-condition__condition-type-cartLineItemTaxation').locator('.sw-select-selection-list__item');
        this.conditionTimeRangeValueFirst = page.locator('.sw-condition-time-range').getByRole('textbox').first()
        this.conditionTimeRangeValueSecond = page.locator('.sw-condition-time-range').getByRole('textbox').last()
        this.conditionOrderCreatedByAdminValue = page.locator('.sw-condition__condition-type-orderCreatedByAdmin').locator('.sw-select__selection');
        this.conditionFilterModal = page.locator('.sw-modal__header').getByText('Filter');
        this.conditionFilterModalCloseButtonX = page.locator('.sw-modal__close');
        this.conditionCartLineItemInStockOperator = page.locator('.sw-condition__condition-type-cartLineItemStock').locator('.sw-single-select__selection-text');
        this.conditionCartLineItemInStockValue = page.locator('.sw-condition__condition-type-cartLineItemStock').getByRole('textbox');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.assignmentModalAddButton = page.locator('.sw-button--primary').getByText('Add');
        } else {
            this.assignmentModalAddButton = page.locator('.mt-button--primary').getByText('Add');
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