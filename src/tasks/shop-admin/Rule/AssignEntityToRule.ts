import {test as base} from '@playwright/test';
import type {Task} from '../../../types/Task';
import type {FixtureTypes} from '../../../types/FixtureTypes';
import {Rule} from '../../../types/ShopwareTypes';

interface Entity {
    id: string;
    name: string;
    entityType: string;
// 'shippingMethod' | 'taxProvider' | 'paymentMethod' | 'promotionOrderRule' | 'promotionCustomerRule' | 'promotionCartRule';
}
export const AssignEntityToRule = base.extend<{ AssignEntityToRule: Task }, FixtureTypes>({
    AssignEntityToRule: async ({ AdminRuleDetail }, use ) => {
        const task = (rule: Rule, entity: Entity) => {
            return async function AssignEntityToRule() {

                await AdminRuleDetail.page.goto(AdminRuleDetail.url(rule.id, 'assignments'));
                if (entity.entityType == 'shippingMethod') {
                    const shippingMethodCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.shippingMethodCard);
                    await shippingMethodCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.shippingMethodCard.getByRole('link').filter({hasText: entity.name}).click();
                }
                if (entity.entityType == 'taxProvider') {
                    const taxProviderCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.taxProviderCard);
                    await taxProviderCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.taxProviderCard.getByRole('link').filter({hasText: entity.name}).click();
                }
                if (entity.entityType == 'paymentMethod') {
                    const paymentMethodCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.paymentMethodCard);
                    await paymentMethodCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.paymentMethodCard.getByRole('link').filter({hasText: entity.name}).click();
                }
                if (entity.entityType == 'promotionOrderRule') {
                    const promotionOrderRuleCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.promotionOrderRuleCard);
                    await promotionOrderRuleCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.promotionOrderRuleCard.getByRole('link').filter({hasText: entity.name}).click();
                }
                if (entity.entityType == 'promotionCustomerRule') {
                    const promotionCustomerRuleCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.promotionCustomerRuleCard);
                    await promotionCustomerRuleCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.promotionCustomerRuleCard.getByRole('link').filter({hasText: entity.name}).click();
                }
                if (entity.entityType == 'promotionCartRule') {
                    const promotionCartRuleCard = await AdminRuleDetail.getRuleCardContent(AdminRuleDetail.promotionCartRuleCard);
                    await promotionCartRuleCard.addAssignmentButton.click();
                    await AdminRuleDetail.page.locator('.sw-settings-rule-add-assignment-modal').getByPlaceholder('Search...').fill(entity.name);
                    await AdminRuleDetail.page.locator('.sw-data-grid__row').filter({hasText: entity.name}).getByRole('checkbox').click();
                    await AdminRuleDetail.page.locator('.sw-button--primary').getByText('Add').click();
                    await AdminRuleDetail.promotionCartRuleCard.getByRole('link').filter({hasText: entity.name}).click();
                }
            }
        }
        await use(task);
    },
});