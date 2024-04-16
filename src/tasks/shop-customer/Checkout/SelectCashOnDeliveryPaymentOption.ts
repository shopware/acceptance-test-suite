import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectCashOnDeliveryPaymentOption = base.extend<{ SelectCashOnDeliveryPaymentOption: Task }, FixtureTypes>({
    SelectCashOnDeliveryPaymentOption: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectCashOnDeliveryPaymentOption() {
                await StorefrontCheckoutConfirm.paymentCashOnDelivery.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.paymentCashOnDelivery).toBeChecked();
            }
        };

        await use(task);
    },
});