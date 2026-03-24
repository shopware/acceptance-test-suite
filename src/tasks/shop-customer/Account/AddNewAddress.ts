import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import type { Address } from "../../../types/ShopwareTypes";

export const AddNewAddress = base.extend<{ AddNewAddress: Task }, FixtureTypes>({
    AddNewAddress: async ({ ShopCustomer, StorefrontAccountAddresses, StorefrontAccountAddressCreate }, use) => {
        const task = (address: Address) => {
            return async function AddNewAddress() {
                await ShopCustomer.presses(StorefrontAccountAddresses.addNewAddressButton);

                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.firstNameInput, address.firstName);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.lastNameInput, address.lastName);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.companyInput, address.company);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.departmentInput, address.department);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.streetInput, address.street);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.zipcodeInput, address.zipcode);
                await ShopCustomer.fillsIn(StorefrontAccountAddressCreate.cityInput, address.city);
                await ShopCustomer.presses(StorefrontAccountAddressCreate.countryDropdown);
                await StorefrontAccountAddressCreate.countryDropdown.selectOption({ label: address.country });

                if (address.state) {
                    await ShopCustomer.presses(StorefrontAccountAddressCreate.stateDropdown);
                    await StorefrontAccountAddressCreate.stateDropdown.selectOption({ label: address.state });
                }

                await ShopCustomer.presses(StorefrontAccountAddressCreate.saveAddressButton);
            };
        };

        await use(task);
    },
});
