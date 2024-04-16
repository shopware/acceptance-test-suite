import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const ProceedFromCartToCheckout = base.extend<{ ProceedFromCartToCheckout: Task }, FixtureTypes>({
    ProceedFromCartToCheckout: async ({
        ShopCustomer,
        StorefrontCheckoutCart,
        StorefrontCheckoutConfirm,
    }, use) => {
        const task = () => {
            return async function ProceedFromCartToCheckout() {
                await StorefrontCheckoutCart.goToCheckoutButton.click();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.headline).toBeVisible();
            }
        }

        await use(task);
    },
});
