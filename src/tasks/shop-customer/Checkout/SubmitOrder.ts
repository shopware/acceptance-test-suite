import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SubmitOrder = base.extend<{ SubmitOrder: Task }, FixtureTypes>({
    SubmitOrder: async ({ ShopCustomer, StorefrontCheckoutConfirm, StorefrontCheckoutFinish }, use)=> {
        const task = () => {
            return async function SubmitOrder() {
                await StorefrontCheckoutConfirm.submitOrderButton.click();
                await ShopCustomer.expects(StorefrontCheckoutFinish.headline).toBeVisible();
            }
        };

        await use(task);
    },
});