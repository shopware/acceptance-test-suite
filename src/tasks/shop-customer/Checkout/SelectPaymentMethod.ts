import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectPaymentMethod = base.extend<{ SelectPaymentMethod: Task }, FixtureTypes>({
    SelectPaymentMethod: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = (paymentOptionName: string) => {
            return async function SelectPaymentMethod() {
                const paymentMethods = StorefrontCheckoutConfirm.paymentMethodRadioGroup;
                const paymentOptionRadioButton = paymentMethods.getByRole('radio', { name: paymentOptionName });

                await ShopCustomer.selectsRadioButton(paymentMethods, paymentOptionName);
                await ShopCustomer.expects(paymentOptionRadioButton).toBeChecked();
            }
        };

        await use(task);
    },
});
