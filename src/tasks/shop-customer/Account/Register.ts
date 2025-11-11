import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { RegistrationData } from '../../../types/ShopwareTypes';
import { getCountryAddressData, getCountryCodeFromLocale, getLocale } from '../../../services/ShopwareDataHelpers';

export const Register = base.extend<{ Register: Task }, FixtureTypes>({
    Register: async ({ ShopCustomer, StorefrontAccountLogin, IdProvider, TestDataService }, use) => {
        let registeredEmail = '';

        const countryCode = getCountryCodeFromLocale(getLocale());
        const countryDefaults = getCountryAddressData(countryCode);

        const defaultRegistrationData: RegistrationData = {
            isCommercial: false,
            isGuest: false,
            salutation: 'Mr.',
            firstName: 'Jeff',
            lastName: 'Goldblum',
            email: `${IdProvider.getIdPair().uuid}@test.com`,
            password: 'shopware',
            ...countryDefaults,
            company: 'shopware',
            department: 'Operations',
        };

        const task = (
            overrides?: Partial<RegistrationData>,
            /**
             * @deprecated The 'isCommercial' argument is deprecated and will be removed in a future version.
             * Please avoid using it and rely on the `isCommercial` field in `RegistrationData` instead.
             */
            isCommercial?: boolean,
        ) => {
            return async function Register() {
                const registrationData = { ...defaultRegistrationData, ...overrides };

                registeredEmail = registrationData.email;

                await ShopCustomer.presses(StorefrontAccountLogin.salutationSelect);
                await StorefrontAccountLogin.salutationSelect.selectOption(registrationData.salutation);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.firstNameInput, registrationData.firstName);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.lastNameInput, registrationData.lastName);


                // Deprecation warning for the 'isCommercial' argument
                if (registrationData.isCommercial || isCommercial) {
                    await ShopCustomer.fillsIn(StorefrontAccountLogin.companyInput,registrationData.company);
                    await ShopCustomer.fillsIn(StorefrontAccountLogin.departmentInput,registrationData.department);
                    await ShopCustomer.fillsIn(StorefrontAccountLogin.vatRegNoInput,registrationData.vatRegNo);
                }

                await ShopCustomer.fillsIn(StorefrontAccountLogin.registerEmailInput,registrationData.email);


                if (!registrationData.isGuest) {
                    await ShopCustomer.fillsIn(StorefrontAccountLogin.registerPasswordInput,registrationData.password);
                }

                await ShopCustomer.fillsIn(StorefrontAccountLogin.streetAddressInput,registrationData.street);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.postalCodeInput,registrationData.postalCode);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.cityInput,registrationData.city);
                await ShopCustomer.presses(StorefrontAccountLogin.countryInput);
                await StorefrontAccountLogin.countryInput.selectOption({ label: registrationData.country });

                await ShopCustomer.presses(StorefrontAccountLogin.registerButton);

                const customer = await TestDataService.getCustomerByEmail(registeredEmail);
                if (customer) {
                    TestDataService.addCreatedRecord('customer', customer.id);
                }
            };
        };

        await use(task);
    },
});
