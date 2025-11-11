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
                await StorefrontCheckoutCart.cartQuantityNumber.clear();
                await ShopCustomer.fillsIn(StorefrontCheckoutCart.cartQuantityNumber, quantity);
                //need to press Enter for unit prices to update
                await ShopCustomer.presses(StorefrontCheckoutCart.cartQuantityNumber, 'Enter');
                await ShopCustomer.expects(StorefrontCheckoutCart.cartQuantityNumber).toHaveValue(quantity);
            }
        }

        await use(task);
    },
});