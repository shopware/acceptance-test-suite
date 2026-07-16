import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const ConfirmTermsAndConditions = base.extend<{ ConfirmTermsAndConditions: Task }, FixtureTypes>({
    ConfirmTermsAndConditions: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use) => {
        const task = () => {
            return async function ConfirmTermsAndConditions() {
                if (await StorefrontCheckoutConfirm.termsAndConditionsCheckbox.isVisible()) {
                    await ShopCustomer.presses(StorefrontCheckoutConfirm.termsAndConditionsCheckbox);
                    await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox).toBeChecked();
                } else {
                    await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAutoConfirmedText).toBeVisible();
                }
            };
        };

        await use(task);
    },
});
