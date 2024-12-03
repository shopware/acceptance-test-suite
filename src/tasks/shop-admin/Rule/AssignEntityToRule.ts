import {Locator, test as base} from '@playwright/test';
import type {Task} from '../../../types/Task';
import type {FixtureTypes} from '../../../types/FixtureTypes';
import {Rule} from '../../../types/ShopwareTypes';

interface Entity {
    id: string;
    name: string;
    entityType: string;
}
export const AssignEntityToRule = base.extend<{ AssignEntityToRule: Task }, FixtureTypes>({
    AssignEntityToRule: async ({ AdminRuleDetail }, use ) => {
        const task = (rule: Rule, entity: Entity) => {
            return async function AssignEntityToRule() {

                await AdminRuleDetail.page.goto(AdminRuleDetail.url(rule.id, 'assignments'));
                async function handleEntityAssignment(entityType: string, card: Locator) {
                    const cardContent = await AdminRuleDetail.getRuleCardContent(card);
                    await cardContent.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({ hasText: entity.name }).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                }
                switch (entity.entityType) {
                    case 'shippingMethod':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.shippingMethodCard);
                        break;
                    case 'taxProvider':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.taxProviderCard);
                        break;
                    case 'paymentMethod':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.paymentMethodCard);
                        break;
                    case 'promotionOrderRule':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.promotionOrderRuleCard);
                        break;
                    case 'promotionCustomerRule':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.promotionCustomerRuleCard);
                        break;
                    case 'promotionCartRule':
                        await handleEntityAssignment(entity.entityType, AdminRuleDetail.promotionCartRuleCard);
                        break;
                    default:
                        throw new Error(`Unknown entityType "${entity.entityType}". Valid entries: "shippingMethod", "taxProvider", "paymentMethod", "promotionOrderRule", "promotionCustomerRule", "promotionCartRule".`);
                }
            }
        }
        await use(task);
    },
});