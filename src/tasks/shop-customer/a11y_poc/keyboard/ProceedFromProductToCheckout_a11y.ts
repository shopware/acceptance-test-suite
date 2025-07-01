import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const ProceedFromProductToCheckout_a11y = base.extend<{ ProceedFromProductToCheckout_a11y: Task }, FixtureTypes>({
    ProceedFromProductToCheckout_a11y: async ({ ShopCustomer, StorefrontProductDetail, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function ProceedFromProductToCheckout() {
                await StorefrontProductDetail.offCanvasCartGoToCheckoutButton.press('Enter');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.headline).toBeVisible();
            }
        };

        await use(task);
    },
});
