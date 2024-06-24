import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

/**
 * @deprecated - Use TestDataService.createPromotionWithCode() instead.
 */
export const PromotionWithCodeData = base.extend<FixtureTypes>({
    PromotionWithCodeData: async ({ AdminApiContext, DefaultSalesChannel, IdProvider }, use) => {

        // Generate promotion code
        const promotionCode = `${IdProvider.getIdPair().id}`;
        const promotionName = `Test Promotion ${promotionCode}`;

        // Create a new promotion with code via admin API context
        const promotionResponse = await AdminApiContext.post('promotion?_response=1', {
            data: {
                name: promotionName,
                active: true,
                maxRedemptionsGlobal: 100,
                maxRedemptionsPerCustomer: 10,
                priority: 1,
                exclusive: false,
                useCodes: true,
                useIndividualCodes: false,
                useSetGroups: false,
                preventCombination: true,
                customerRestriction: false,
                code: promotionCode,
                discounts: [
                    {
                        scope: 'cart',
                        type: 'percentage',
                        value: 10,
                        considerAdvancedRules: false,
                    },
                ],
                salesChannels: [
                    {
                        salesChannelId: DefaultSalesChannel.salesChannel.id,
                        priority: 1,
                    },
                ],
            },
        });

        expect(promotionResponse.ok()).toBeTruthy();

        const { data: promotion } = (await promotionResponse.json()) as { data: components['schemas']['Promotion'] };

        // User promotion data in the test
        await use(promotion);

        // Delete promotion after test is done
        const cleanupResponse = await AdminApiContext.delete(`promotion/${promotion.id}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});
