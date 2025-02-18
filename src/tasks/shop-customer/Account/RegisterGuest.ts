import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';

/**
 * @deprecated - Use `Register.ts` instead.
 */

export const RegisterGuest = base.extend<{ RegisterGuest: Task }, FixtureTypes>({
    RegisterGuest: async ({ StorefrontAccountLogin, AdminApiContext }, use) => {

        const registrationData = {
            firstName: 'Jeff',
            lastName: 'Goldblum',
            email: 'invalid',
            password: 'shopware',
            street: 'Ebbinghof 10',
            city: 'Schöppingen',
            country: 'Germany',
            postalCode: '48624',
        }

        const task = (email: string, country = 'Germany') => {
            return async function RegisterGuest() {

                registrationData.email = email;

                await StorefrontAccountLogin.firstNameInput.fill(registrationData.firstName);
                await StorefrontAccountLogin.lastNameInput.fill(registrationData.lastName);

                await StorefrontAccountLogin.registerEmailInput.fill(registrationData.email);

                await StorefrontAccountLogin.streetAddressInput.fill(registrationData.street);
                await StorefrontAccountLogin.cityInput.fill(registrationData.city);
                if (country != 'Germany') {
                    await StorefrontAccountLogin.countryInput.selectOption(country);

                } else {
                    await StorefrontAccountLogin.countryInput.selectOption(registrationData.country);

                }
                await StorefrontAccountLogin.postalCodeInput.fill(registrationData.postalCode);

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
