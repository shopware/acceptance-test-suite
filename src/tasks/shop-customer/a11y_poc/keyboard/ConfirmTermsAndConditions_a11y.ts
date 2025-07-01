import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';

export const ConfirmTermsAndConditions_a11y = base.extend<{ ConfirmTermsAndConditions_a11y: Task }, FixtureTypes>({
    ConfirmTermsAndConditions_a11y: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use)=> {
        const task = () => {
            return async function ConfirmTermsAndConditions() {
                await StorefrontCheckoutConfirm.termsAndConditionsCheckbox.press('Space');
                await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeChecked();
            }
        };

        await use(task);
    },
});
