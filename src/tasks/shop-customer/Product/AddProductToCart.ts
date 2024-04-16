import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

export const AddProductToCart = base.extend<{ AddProductToCart: Task }, FixtureTypes>({
    AddProductToCart: async ({ ShopCustomer, StorefrontProductDetail }, use)=> {
        const task = (ProductData: components['schemas']['Product'], quantity = '1') => {
            return async function AddProductToCart() {
                await StorefrontProductDetail.quantitySelect.fill(quantity);

                await StorefrontProductDetail.addToCartButton.click();

                await ShopCustomer.expects(StorefrontProductDetail.offCanvasCartTitle).toBeVisible();
                await ShopCustomer.expects(StorefrontProductDetail.offCanvasCart.getByText(ProductData.name)).toBeVisible();
            }
        };

        await use(task);
    },
});