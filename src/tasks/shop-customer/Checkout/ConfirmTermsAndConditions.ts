import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const ConfirmTermsAndConditions = base.extend<{ ConfirmTermsAndConditions: Task }, FixtureTypes>({
    ConfirmTermsAndConditions: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function ConfirmTermsAndConditions() {
                await StorefrontCheckoutConfirm.termsAndConditionsCheckbox.check();
                await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeChecked();
            }
        };

        await use(task);
    },
});
