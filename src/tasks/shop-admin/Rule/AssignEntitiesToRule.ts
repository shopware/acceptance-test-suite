import {Locator, test as base} from '@playwright/test';
import type {Task} from '../../../types/Task';
import type {FixtureTypes} from '../../../types/FixtureTypes';

interface Entity {
    id: string;
    name: string;
    ruleType: string;
}
export const AssignEntitiesToRule = base.extend<{ AssignEntitiesToRule: Task }, FixtureTypes>({
    AssignEntitiesToRule: async ({ AdminRuleDetail }, use ) => {
        const task = (assignableEntities: Entity[]) => {
            return async function AssignEntitiesToRule() {
                async function entityAssignment(entityName: string, card: Locator) {
                        const entityCard = await AdminRuleDetail.getEntityCard(card);
                        await entityCard.addAssignmentButton.click();
                        await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entityName);
                        await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entityName}).getByRole('checkbox').click();
                        await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                }
                for (const entity of assignableEntities) {
                    const validRuleType = {
                        shipping1: 'shippingMethodAvailabilityRule',
                        tax1: 'taxProviderRule',
                        payment1: 'paymentMethodAvailabilityRule',
                        promotion1: 'promotionOrderRule',
                        promotion2: 'promotionCustomerRule',
                        promotion3: 'promotionCartRule',
                    };
                    switch (entity.ruleType) {
                        case validRuleType.shipping1:
                            await entityAssignment(entity.name, AdminRuleDetail.shippingMethodAvailabilityRulesCard);
                            break;
                        case validRuleType.tax1:
                            await entityAssignment(entity.name, AdminRuleDetail.taxProviderRulesCard);
                            break;
                        case validRuleType.payment1:
                            await entityAssignment(entity.name, AdminRuleDetail.paymentMethodsAvailabilityRulesCard);
                            break;
                        case validRuleType.promotion1:
                            await entityAssignment(entity.name, AdminRuleDetail.promotionOrderRulesCard);
                            break;
                        case validRuleType.promotion2:
                            await entityAssignment(entity.name, AdminRuleDetail.promotionCustomerRulesCard);
                            break;
                        case validRuleType.promotion3:
                            await entityAssignment(entity.name, AdminRuleDetail.promotionCartRulesCard);
                            break;
                        default:
                            throw new Error(`Unknown rule type "${entity.ruleType}". Valid rule types: "${Object.values(validRuleType).join('", "')}".`);
                    }
                }
            }
        }
        await use(task);
    },
});
