import {Locator, test as base} from '@playwright/test';
import type {Task} from '../../../types/Task';
import type {FixtureTypes} from '../../../types/FixtureTypes';
import {RuleType} from '../../../types/ShopwareTypes';
import {RuleAssignmentEntities} from '../../../types/ShopwareTypes';

export const AssignEntitiesToRule = base.extend<{ AssignEntitiesToRule: Task }, FixtureTypes>({
    AssignEntitiesToRule: async ({ AdminRuleDetail }, use ) => {
        const task = (assignableEntities: RuleAssignmentEntities[]) => {
            return async function AssignEntitiesToRule() {
                async function entityAssignment(entityName: string, card: Locator) {
                        const entityCard = await AdminRuleDetail.getEntityCard(card);
                        await entityCard.addAssignmentButton.click();
                        await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entityName);
                        await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entityName}).getByRole('checkbox').click();
                        await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                }
                for (const entity of assignableEntities) {
                    switch (entity.ruleType) {
                        case RuleType.shippingAvailability:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.shippingMethodAvailabilityRulesCard);
                            break;
                        case RuleType.taxAvailability:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.taxProviderRulesCard);
                            break;
                        case RuleType.paymentAvailability:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.paymentMethodsAvailabilityRulesCard);
                            break;
                        case RuleType.promotionOrder:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.promotionOrderRulesCard);
                            break;
                        case RuleType.promotionCustomer:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.promotionCustomerRulesCard);
                            break;
                        case RuleType.promotionCart:
                            await entityAssignment(entity.entity.name, AdminRuleDetail.promotionCartRulesCard);
                            break;
                        default:
                            throw new Error(`Unknown rule type "${entity.ruleType}". Valid rule types: "${Object.values(RuleType).join('", "')}".`);
                    }
                }
            }
        }
        await use(task);
    },
});
