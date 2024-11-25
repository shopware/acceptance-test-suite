import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

export const Register = base.extend<{ Register: Task }, FixtureTypes>({
    Register: async ({ StorefrontAccountLogin, AdminApiContext }, use) => {

        const registrationData = {
            firstName: 'Jeff',
            lastName: 'Goldblum',
            email: 'invalid',
            password: 'shopware',
            street: 'Ebbinghof 10',
            city: 'Schöppingen',
            country: 'Germany',
            postalCode: '48624',
            company: 'shopware', 
            department: 'Operations', 
            vatRegNo: 'DE1234567890',
        }

        const task = (email: string, isCommercial?: boolean) => {
            return async function Register() {

                registrationData.email = email;

                await StorefrontAccountLogin.firstNameInput.fill(registrationData.firstName);
                await StorefrontAccountLogin.lastNameInput.fill(registrationData.lastName);

                await StorefrontAccountLogin.registerEmailInput.fill(registrationData.email);

                await StorefrontAccountLogin.registerPasswordInput.fill(registrationData.password);
                await StorefrontAccountLogin.streetAddressInput.fill(registrationData.street);
                await StorefrontAccountLogin.cityInput.fill(registrationData.city);
                await StorefrontAccountLogin.countryInput.selectOption(registrationData.country);
                await StorefrontAccountLogin.postalCodeInput.fill(registrationData.postalCode);

                // Fill commercial fields if applicable
                if (isCommercial) {
                    await StorefrontAccountLogin.companyInput.fill(registrationData.company);
                    await StorefrontAccountLogin.departmentInput.fill(registrationData.department);
                    await StorefrontAccountLogin.vatRegNoInput.fill(registrationData.vatRegNo);
                }
                
                await StorefrontAccountLogin.registerButton.click();
            }
        };

        await use(task);

        const customerResponse = await AdminApiContext.post('search/customer', {
            data: {
                limit: 1,
                filter: [{
                    type: 'equals',
                    field: 'email',
                    value: registrationData.email,
                }],
            },
        });
        expect(customerResponse.ok()).toBeTruthy();

        const customerResponseData = await customerResponse.json() as { data: components['schemas']['Customer'][] };

        for (const customer of customerResponseData.data) {
            await AdminApiContext.delete(`customer/${customer.id}`);
        }
    },
});
