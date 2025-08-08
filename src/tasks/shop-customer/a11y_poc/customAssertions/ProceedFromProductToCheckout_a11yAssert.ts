import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const ProceedFromProductToCheckout_a11yAssert = base.extend<{ ProceedFromProductToCheckout_a11yAssert: Task }, FixtureTypes>({
    ProceedFromProductToCheckout_a11yAssert: async ({ ShopCustomer, StorefrontProductDetail, StorefrontCheckoutConfirm, StorefrontOffCanvasCart }, use)=> {
        const task = () => {
            return async function ProceedFromProductToCheckout() {
                //await StorefrontProductDetail.offCanvasCartGoToCheckoutButton.press('Enter');
                await ShopCustomer.presses(StorefrontProductDetail.offCanvasCartGoToCheckoutButton, 'Enter');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.headline).toBeVisible();
            }
        };

        await use(task);
    },
});
