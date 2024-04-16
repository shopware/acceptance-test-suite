import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectStandardShippingOption = base.extend<{ SelectStandardShippingOption: Task }, FixtureTypes>({
    SelectStandardShippingOption: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectStandardShippingOption() {
                await StorefrontCheckoutConfirm.shippingStandard.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.shippingStandard).toBeChecked();
            }
        };

        await use(task);
    },
});
