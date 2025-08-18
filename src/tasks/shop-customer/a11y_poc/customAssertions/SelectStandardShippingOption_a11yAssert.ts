import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const SelectStandardShippingOption_a11yAssert = base.extend<{ SelectStandardShippingOption_a11yAssert: Task }, FixtureTypes>({
    SelectStandardShippingOption_a11yAssert: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectStandardShippingOption() {
                //await StorefrontCheckoutConfirm.shippingStandard.check();
                await ShopCustomer.selectsValue(StorefrontCheckoutConfirm.shippingMethod, 'Standard');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.shippingStandard).toBeChecked();
            }
        };

        await use(task);
    },
});
