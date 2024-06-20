import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { Category } from '../../types/ShopwareTypes';

/**
 * @deprecated - Use TestDataService.createCategory() instead.
 */
export const CategoryData = base.extend<FixtureTypes>({
    CategoryData: async ({ IdProvider, AdminApiContext, DefaultSalesChannel, ProductData }, use) => {

        const { id: categoryId, uuid: categoryUuid } = IdProvider.getIdPair();
        const categoryName = `Category-${categoryId}`;

        const categoryResponse = await AdminApiContext.post('category?_response', {
            data: {
                id: categoryUuid,
                name: categoryName,
                parentId: DefaultSalesChannel.salesChannel.navigationCategoryId,
                displayNestedProducts: true,
                type: 'page',
                productAssignmentType: 'product',
                visible: true,
                active: true,
                products: [{
                    id: ProductData.id,
                }],
            },
        });

        expect(categoryResponse.ok()).toBeTruthy();

        const { data: category } = (await categoryResponse.json()) as { data: Category };

        await use(category);

        const cleanupResponse = await AdminApiContext.delete(`category/${categoryUuid}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});