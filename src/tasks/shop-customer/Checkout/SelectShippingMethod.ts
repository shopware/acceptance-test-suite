import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";

export const SelectShippingMethod = base.extend<{ SelectShippingMethod: Task }, FixtureTypes>({
    SelectShippingMethod: async ({ ShopCustomer, StorefrontCheckoutConfirm }, use) => {
        const task = (shippingOptionName: string) => {
            return async function SelectShippingMethod() {
                const shippingMethods = StorefrontCheckoutConfirm.shippingMethodRadioGroup;
                const shippingOptionRadioButton = shippingMethods.getByRole("radio", { name: shippingOptionName });

                await ShopCustomer.selectsRadioButton(shippingMethods, shippingOptionName);
                await ShopCustomer.expects(shippingOptionRadioButton).toBeChecked();
            };
        };

        await use(task);
    },
});
