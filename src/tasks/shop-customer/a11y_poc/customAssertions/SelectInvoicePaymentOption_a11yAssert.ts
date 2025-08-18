import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const SelectInvoicePaymentOption_a11yAssert = base.extend<{ SelectInvoicePaymentOption_a11yAssert: Task }, FixtureTypes>({
    SelectInvoicePaymentOption_a11yAssert: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectInvoicePaymentOption() {
                //await StorefrontCheckoutConfirm.paymentInvoice.check();
                await ShopCustomer.selectsValue(StorefrontCheckoutConfirm.paymentMethod, 'Invoice');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.paymentInvoice).toBeChecked();
            }
        };

        await use(task);
    },
});
