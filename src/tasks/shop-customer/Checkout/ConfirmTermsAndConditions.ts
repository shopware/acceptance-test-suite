import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const ConfirmTermsAndConditions = base.extend<
    {
        ConfirmTermsAndConditions: Task;
        ConfirmTermsAndConditionsWithLegalGuaranteeRights: Task;
    },
    FixtureTypes
>({
    ConfirmTermsAndConditions: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use) => {
        const task = () => {
            return async function ConfirmTermsAndConditions() {
                // Wait for the terms section to render before the non-waiting isVisible() check below.
                await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsCheckbox.or(StorefrontCheckoutConfirm.termsAutoConfirmedText).first()).toBeVisible();

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
    /**
     * TOS acceptance when `core.cart.showLegalGuaranteeNotice` is enabled.
     * The accessible name changes, so interaction uses the stable #tos input.
     */
    ConfirmTermsAndConditionsWithLegalGuaranteeRights: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use) => {
        const task = () => {
            return async function ConfirmTermsAndConditionsWithLegalGuaranteeRights() {
                await ShopCustomer.expects(StorefrontCheckoutConfirm.termsAndConditionsWithLegalGuaranteeRightsLabel).toBeVisible();
                const tosCheckbox = StorefrontCheckoutConfirm.termsAndConditionsWithLegalGuaranteeRightsCheckbox;
                await ShopCustomer.expects(tosCheckbox).toBeVisible();
                await tosCheckbox.check();
                await ShopCustomer.expects(tosCheckbox).toBeChecked();
            };
        };

        await use(task);
    },
});
