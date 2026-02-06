import { test as base } from "@playwright/test";
import type { Locator } from "playwright-core";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import { RuleType } from "../../../types/ShopwareTypes";
import type { RuleAssignmentEntity } from "../../../types/ShopwareTypes";

export const AssignEntitiesToRule = base.extend<{ AssignEntitiesToRule: Task }, FixtureTypes>({
    AssignEntitiesToRule: async ({ AdminRuleDetail }, use) => {
        const task = (assignableEntities: RuleAssignmentEntity[]) => {
            return async function AssignEntitiesToRule() {
                async function entityAssignment(entityName: string, card: Locator) {
                    const entityCard = await AdminRuleDetail.getEntityCard(card);
                    await entityCard.addAssignmentButton.click();
                    await AdminRuleDetail.assignmentModalSearchField.fill(entityName);
                    await AdminRuleDetail.page.locator(".sw-data-grid__row").filter({ hasText: entityName }).getByRole("checkbox").click();
                    await AdminRuleDetail.assignmentModalAddButton.click();
                }
                for (const assignableEntity of assignableEntities) {
                    switch (assignableEntity.ruleType) {
                        case RuleType.shippingAvailability:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.shippingMethodAvailabilityRulesCard);
                            break;
                        case RuleType.taxAvailability:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.taxProviderRulesCard);
                            break;
                        case RuleType.paymentAvailability:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.paymentMethodsAvailabilityRulesCard);
                            break;
                        case RuleType.promotionOrder:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.promotionOrderRulesCard);
                            break;
                        case RuleType.promotionCustomer:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.promotionCustomerRulesCard);
                            break;
                        case RuleType.promotionCart:
                            await entityAssignment(assignableEntity.entity.name, AdminRuleDetail.promotionCartRulesCard);
                            break;
                        default:
                            throw new Error(`Unknown rule type "${assignableEntity.ruleType}". Valid rule types: "${Object.values(RuleType).join('", "')}".`);
                    }
                }
            };
        };
        await use(task);
    },
});
