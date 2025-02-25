import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import { Address } from '../../../types/ShopwareTypes';

export const AddNewAddress = base.extend<{ AddNewAddress: Task }, FixtureTypes>({
    AddNewAddress: async ({ StorefrontAccountAddresses, StorefrontAccountAddressCreate }, use)=> {
        const task = (address: Address) => {
            return async function AddNewAddress() {
                await StorefrontAccountAddresses.addNewAddressButton.click();

                await StorefrontAccountAddressCreate.firstNameInput.fill(address.firstName);
                await StorefrontAccountAddressCreate.lastNameInput.fill(address.lastName);
                await StorefrontAccountAddressCreate.companyInput.fill(address.company);
                await StorefrontAccountAddressCreate.departmentInput.fill(address.department);
                await StorefrontAccountAddressCreate.streetInput.fill(address.street);
                await StorefrontAccountAddressCreate.zipcodeInput.fill(address.zipCode);
                await StorefrontAccountAddressCreate.cityInput.fill(address.city);
                await StorefrontAccountAddressCreate.countryDropdown.selectOption({label: address.country});

                if (address.state) {
                    await StorefrontAccountAddressCreate.stateDropdown.selectOption({label: address.state});
                }

                await StorefrontAccountAddressCreate.saveAddressButton.click();
            }
        };

        await use(task);
    },
});
