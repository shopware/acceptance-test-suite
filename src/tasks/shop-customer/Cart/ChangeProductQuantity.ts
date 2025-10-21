import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const ChangeProductQuantity = base.extend<{ ChangeProductQuantity: Task }, FixtureTypes>({
    ChangeProductQuantity: async ({
        ShopCustomer,
        StorefrontCheckoutCart,
    }, use) => {
        const task = (quantity: string) => {
            return async function ChangeProductQuantityOnCart() {
                await ShopCustomer.fillsIn(StorefrontCheckoutCart.cartQuantityNumber, quantity);
                await ShopCustomer.presses(StorefrontCheckoutCart.cartQuantityNumber);
                await ShopCustomer.expects(StorefrontCheckoutCart.cartQuantityNumber).toHaveValue(quantity);
            }
        }

        await use(task);
    },
});