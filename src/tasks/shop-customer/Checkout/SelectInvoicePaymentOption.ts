import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const SelectInvoicePaymentOption = base.extend<{ SelectInvoicePaymentOption: Task }, FixtureTypes>({
    SelectInvoicePaymentOption: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectInvoicePaymentOption() {
                await StorefrontCheckoutConfirm.paymentInvoice.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.paymentInvoice).toBeChecked();
            }
        };

        await use(task);
    },
});
