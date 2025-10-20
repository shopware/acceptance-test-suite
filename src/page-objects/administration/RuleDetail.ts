import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { RuleCreate } from './RuleCreate';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';
import { translate } from '../../services/LanguageHelper';

export class RuleDetail extends RuleCreate implements PageObject {
    public readonly contentView: Locator;
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
    public readonly assignmentModal: Locator;
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
    public readonly conditionORContainer: Locator;
    public readonly adminMenuAvatar: Locator;

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        super(page, instanceMeta);
        this.contentView = page.locator('.sw-desktop__content');
        this.shippingMethodAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-shipping_method_availability_rule');
        this.shippingMethodAvailabilityRulesCardLink = this.shippingMethodAvailabilityRulesCard.getByRole('link');
        this.shippingMethodAvailabilityRulesCardTable = page.locator('.sw-settings-rule-detail-assignments__entity-listing-shipping_method_availability_rule');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.shippingMethodAvailabilityRulesCardEmptyState = this.shippingMethodAvailabilityRulesCard.getByRole('alert');
        } else {
            this.shippingMethodAvailabilityRulesCardEmptyState = this.shippingMethodAvailabilityRulesCard.locator('.mt-empty-state__headline');
        }
        this.shippingMethodAvailabilityRulesCardSearchField = this.shippingMethodAvailabilityRulesCard.getByRole('textbox');
        this.taxProviderRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-tax_provider');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.taxProviderRulesCardEmptyState = this.taxProviderRulesCard.getByRole('alert');
        } else {
            this.taxProviderRulesCardEmptyState = this.taxProviderRulesCard.locator('.mt-empty-state__headline');
        }
        this.paymentMethodsAvailabilityRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-payment_method');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.paymentMethodsAvailabilityRulesCardEmptyState = this.paymentMethodsAvailabilityRulesCard.getByRole('alert');
        } else {
            this.paymentMethodsAvailabilityRulesCardEmptyState = this.paymentMethodsAvailabilityRulesCard.locator('.mt-empty-state__headline');
        }
        this.paymentMethodsAvailabilityRulesCardLink = page.locator('.sw-settings-rule-detail-assignments__card-payment_method').getByRole('link');
        this.promotionOrderRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_order_rule');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.promotionOrderRulesCardEmptyState = this.promotionOrderRulesCard.getByRole('alert');
        } else {
            this.promotionOrderRulesCardEmptyState = this.promotionOrderRulesCard.locator('.mt-empty-state__headline');
        }
        this.promotionCustomerRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_customer_rule');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.promotionCustomerRulesCardEmptyState = this.promotionCustomerRulesCard.getByRole('alert');
        } else {
            this.promotionCustomerRulesCardEmptyState = this.promotionCustomerRulesCard.locator('.mt-empty-state__headline');
        }
        this.promotionCartRulesCard = page.locator('.sw-settings-rule-detail-assignments__card-promotion_cart_rule');
        if (satisfies(instanceMeta.version, '<6.7.3')) {
            this.promotionCartRulesCardEmptyState = this.promotionCartRulesCard.getByRole('alert');
        } else {
            this.promotionCartRulesCardEmptyState = this.promotionCartRulesCard.locator('.mt-empty-state__headline');
        }
        this.assignmentModal = page.locator('.sw-settings-rule-add-assignment-modal');
        this.assignmentModalSearchField = page.locator('.sw-settings-rule-add-assignment-modal').getByRole('textbox');
        this.adminMenuAvatar = page.locator('.sw-admin-menu__avatar');
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
            this.assignmentModalAddButton = this.assignmentModal.locator('.sw-button--primary').getByText(translate('administration:rule:buttons.add'));
        } else {
            this.assignmentModalAddButton = this.assignmentModal.locator('.mt-button--primary').getByText(translate('administration:rule:buttons.add'));
        }
        this.conditionORContainer = page.locator('.sw-condition-or-container');
    }

    async getEntityCard(cardLocator: Locator): Promise<Record<string, Locator>> {
        return {
            addAssignmentButton: cardLocator.getByText(translate('administration:rule:buttons.addAssignment')),
        };
    }

    url(ruleId?: string, tabName = 'base') {
        return `#/sw/settings/rule/detail/${ruleId}/${tabName}`;
    }
}
