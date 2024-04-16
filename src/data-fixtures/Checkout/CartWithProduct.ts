import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../../types/FixtureTypes';

export const CartWithProductData = base.extend<FixtureTypes>({
    CartWithProductData: async ({ StoreApiContext, DefaultSalesChannel, ProductData }, use) => {
        // Login customer in store API context.
        await StoreApiContext.login(DefaultSalesChannel.customer);

        // Create new cart for the shop customer.
        const cartResponse = await StoreApiContext.post('checkout/cart', {
            data: {
                name: 'default-customer-cart',
            },
        });

        expect(cartResponse.ok()).toBeTruthy();

        // Create new line items in the cart.
        const lineItemResponse = await StoreApiContext.post('checkout/cart/line-item', {
            data: {
                items: [
                    {
                        type: 'product',
                        referencedId: ProductData.id,
                        quantity: 10,
                    },
                ],
            },
        });

        expect(lineItemResponse.ok()).toBeTruthy();

        const cartData = await lineItemResponse.json();

        await use(cartData);
    },
});
