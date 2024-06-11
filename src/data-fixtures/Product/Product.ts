import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';
import type { Product } from '../../types/ShopwareTypes';

export const ProductData = base.extend<FixtureTypes>({
    ProductData: async ({ IdProvider, SalesChannelBaseConfig, AdminApiContext, DefaultSalesChannel }, use) => {

        // Generate unique IDs
        const { id: productId, uuid: productUuid } = IdProvider.getIdPair();
        const productName = `Product_test_${productId}`;

        // Create product
        const productResponse = await AdminApiContext.post('./product?_response', {
            data: {
                active: true,
                stock: 10,
                taxId: SalesChannelBaseConfig.taxId,
                id: productUuid,
                name: productName,
                productNumber: 'Product-' + productId,
                price: [
                    {
                        currencyId: SalesChannelBaseConfig.eurCurrencyId,
                        gross: 10,
                        linked: false,
                        net: 8.4,
                    },
                    {
                        currencyId: SalesChannelBaseConfig.defaultCurrencyId,
                        gross: 10,
                        linked: false,
                        net: 8.4,
                    },
                ],
                purchasePrices: [
                    {
                        currencyId: SalesChannelBaseConfig.eurCurrencyId,
                        gross: 8,
                        linked: false,
                        net: 6.7,
                    },
                    {
                        currencyId: SalesChannelBaseConfig.defaultCurrencyId,
                        gross: 8,
                        linked: false,
                        net: 6.7,
                    },
                ],
                visibilities: [
                    {
                        salesChannelId: DefaultSalesChannel.salesChannel.id,
                        visibility: 30,
                    },
                ],
                categories: [
                    {
                        id: DefaultSalesChannel.salesChannel.navigationCategoryId,
                    },
                ],
            },
        });
        expect(productResponse.ok()).toBeTruthy();

        const { data: product } = (await productResponse.json()) as { data: Product };

        // Use product data in the test
        await use(product);

        // Delete product after the test is done
        const cleanupResponse = await AdminApiContext.delete(`./product/${productUuid}`);
        expect(cleanupResponse.ok()).toBeTruthy();
    },
});
