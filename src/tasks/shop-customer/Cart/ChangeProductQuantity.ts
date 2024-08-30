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
                await StorefrontCheckoutCart.cartQuantityNumber.fill(quantity);
                await StorefrontCheckoutCart.cartQuantityNumber.press('Enter');
                await ShopCustomer.expects(StorefrontCheckoutCart.cartQuantityNumber).toHaveValue(quantity);
            }
        }

        await use(task);
    },
});