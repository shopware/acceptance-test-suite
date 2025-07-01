import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const SubmitOrder_a11yAssert = base.extend<{ SubmitOrder_a11yAssert: Task }, FixtureTypes>({
    SubmitOrder_a11yAssert: async ({ ShopCustomer, StorefrontCheckoutConfirm, StorefrontCheckoutFinish }, use)=> {
        const task = () => {
            return async function SubmitOrder() {
                //await StorefrontCheckoutConfirm.submitOrderButton.press('Enter');
                
                await ShopCustomer.presses(StorefrontCheckoutConfirm.submitOrderButton,'Enter');
                await ShopCustomer.expects(StorefrontCheckoutFinish.headline).toBeVisible();
            }
        };

        await use(task);
    },
});