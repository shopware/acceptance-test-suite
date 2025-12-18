import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const CloseTheOffCanvasCart = base.extend<{ CloseTheOffCanvasCart: Task }, FixtureTypes>({
    CloseTheOffCanvasCart: async ({
        ShopCustomer,
        StorefrontOffCanvasCart,
    }, use) => {
        const task = () => {
            return async function CloseTheOffCanvasCart() {
                await StorefrontOffCanvasCart.continueShoppingButton.scrollIntoViewIfNeeded();
                await ShopCustomer.presses(StorefrontOffCanvasCart.continueShoppingButton);
            }
        }

        await use(task);
    },
});