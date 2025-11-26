import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SubmitOrder = base.extend<{ SubmitOrder: Task }, FixtureTypes>({
    SubmitOrder: async ({ ShopCustomer, StorefrontCheckoutConfirm, StorefrontCheckoutFinish, StorefrontPage, }, use)=> {
        const task = () => {
            return async function SubmitOrder() {
                await ShopCustomer.presses(StorefrontCheckoutConfirm.submitOrderButton);
                await StorefrontPage.waitForURL('**/checkout/finish**',{ waitUntil: 'commit' });
                await ShopCustomer.expects(StorefrontCheckoutFinish.headline).toBeVisible();
            }
        };

        await use(task);
    },
});