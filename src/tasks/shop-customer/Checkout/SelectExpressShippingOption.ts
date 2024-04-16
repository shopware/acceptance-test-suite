import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectExpressShippingOption = base.extend<{ SelectExpressShippingOption: Task }, FixtureTypes>({
    SelectExpressShippingOption: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectExpressShippingOption() {
                await StorefrontCheckoutConfirm.shippingExpress.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.shippingExpress).toBeChecked();
            }
        };

        await use(task);
    },
});
