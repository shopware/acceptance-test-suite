import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const SelectInvoicePaymentOption_a11y = base.extend<{ SelectInvoicePaymentOption_a11y: Task }, FixtureTypes>({
    SelectInvoicePaymentOption_a11y: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function SelectInvoicePaymentOption() {
                await StorefrontCheckoutConfirm.paymentInvoice.press('Space');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.paymentInvoice).toBeChecked();
            }
        };

        await use(task);
    },
});
