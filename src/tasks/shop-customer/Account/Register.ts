import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { RegistrationData } from '../../../types/ShopwareTypes';

export const Register = base.extend<{ Register: Task }, FixtureTypes>({
    Register: async ({ StorefrontAccountLogin, IdProvider, TestDataService }, use) => {
        let registeredEmail = '';

        const defaultRegistrationData: RegistrationData = {
            isCommercial: false,
            isGuest: false,
            salutation: 'Mr.',
            firstName: 'Jeff',
            lastName: 'Goldblum',
            email: `${IdProvider.getIdPair().uuid}@test.com`,
            password: 'shopware',
            street: 'Ebbinghof 10',
            city: 'Schöppingen',
            country: 'Germany',
            postalCode: '48624',
            company: 'shopware',
            department: 'Operations',
            vatRegNo: 'DE1234567890',
        };

        const task = (
            overrides?: Partial<RegistrationData>,
            /**
             * @deprecated The 'isCommercial' argument is deprecated and will be removed in a future version.
             * Please avoid using it and rely on the `isCommercial` field in `RegistrationData` instead.
             */
            isCommercial?: boolean
        ) => {
            return async function Register() {
                const registrationData = { ...defaultRegistrationData, ...overrides };

                registeredEmail = registrationData.email;

                await StorefrontAccountLogin.salutationSelect.selectOption(registrationData.salutation);
                await StorefrontAccountLogin.firstNameInput.fill(registrationData.firstName);
                await StorefrontAccountLogin.lastNameInput.fill(registrationData.lastName);

                // Deprecation warning for the 'isCommercial' argument
                if (registrationData.isCommercial || isCommercial) {
                    await StorefrontAccountLogin.companyInput.fill(registrationData.company);
                    await StorefrontAccountLogin.departmentInput.fill(registrationData.department);
                    await StorefrontAccountLogin.vatRegNoInput.fill(registrationData.vatRegNo);
                }

                await StorefrontAccountLogin.registerEmailInput.fill(registrationData.email);

                if (!registrationData.isGuest) {
                    await StorefrontAccountLogin.registerPasswordInput.fill(registrationData.password);
                }

                await StorefrontAccountLogin.streetAddressInput.fill(registrationData.street);
                await StorefrontAccountLogin.postalCodeInput.fill(registrationData.postalCode);
                await StorefrontAccountLogin.cityInput.fill(registrationData.city);
                console.log('registrationData.country', registrationData.country);
                console.log('await StorefrontAccountLogin.countryInput', await StorefrontAccountLogin.countryInput.allTextContents());
                await StorefrontAccountLogin.countryInput.selectOption({ label: registrationData.country });

                await StorefrontAccountLogin.registerButton.click();

                const customer = await TestDataService.getCustomerByEmail(registeredEmail);
                if (customer) {
                    TestDataService.addCreatedRecord('customer', customer.id);
                }
            };
        };

        await use(task);
    },
});
