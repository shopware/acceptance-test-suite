import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const ConfirmTermsAndConditions_a11yAssert = base.extend<{ ConfirmTermsAndConditions_a11yAssert: Task }, FixtureTypes>({
    ConfirmTermsAndConditions_a11yAssert: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function ConfirmTermsAndConditions() {
                //await StorefrontCheckoutConfirm.termsAndConditionsCheckbox.press('Space');
                await ShopCustomer.presses(StorefrontCheckoutConfirm.termsAndConditionsCheckbox,'Space');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeChecked();
            }
        };

        await use(task);
    },
});
