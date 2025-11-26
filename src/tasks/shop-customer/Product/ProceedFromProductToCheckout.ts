import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const ProceedFromProductToCheckout = base.extend<{ ProceedFromProductToCheckout: Task }, FixtureTypes>({
    ProceedFromProductToCheckout: async ({ ShopCustomer, StorefrontProductDetail, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function ProceedFromProductToCheckout() {
                await StorefrontProductDetail.offCanvasCartGoToCheckoutButton.scrollIntoViewIfNeeded();
                await ShopCustomer.presses(StorefrontProductDetail.offCanvasCartGoToCheckoutButton);
                await StorefrontCheckoutConfirm.page.waitForURL('commit');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.headline).toBeVisible();
            }
        };

        await use(task);
    },
});
