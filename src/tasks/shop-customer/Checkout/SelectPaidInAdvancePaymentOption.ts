import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectPaidInAdvancePaymentOption = base.extend<{ SelectPaidInAdvancePaymentOption: Task }, FixtureTypes>({
    SelectPaidInAdvancePaymentOption: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectPaidInAdvancePaymentOption() {
                await StorefrontCheckoutConfirm.paymentPaidInAdvance.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.paymentPaidInAdvance).toBeChecked();
            }
        };

        await use(task);
    },
});
