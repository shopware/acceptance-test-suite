import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import type { RegistrationData } from '../../../types/ShopwareTypes';
import { getCountryCodeFromLocale, getLocale } from '../../../services/ShopwareDataHelpers';

const COUNTRY_REGISTRATION_DATA = {
    DE: {
        street: 'Ebbinghof 10',
        city: 'Schöppingen',
        country: 'Germany',
        postalCode: '48624',
        vatRegNo: 'DE1234567890',
    },
    US: {
        street: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        country: 'United States',
        postalCode: '20500',
        vatRegNo: 'US123456789',
    },
    GB: {
        street: '10 Downing Street',
        city: 'London',
        country: 'United Kingdom',
        postalCode: 'SW1A 2AA',
        vatRegNo: 'GB123456789',
    },
};

const getDefaultRegistrationDataForCountry = (countryCode: string) => {
    return COUNTRY_REGISTRATION_DATA[countryCode as keyof typeof COUNTRY_REGISTRATION_DATA] || COUNTRY_REGISTRATION_DATA.GB;
};

export const Register = base.extend<{ Register: Task }, FixtureTypes>({
    Register: async ({ StorefrontAccountLogin, IdProvider, TestDataService }, use) => {
        let registeredEmail = '';

        const countryCode = getCountryCodeFromLocale(getLocale());
        const countryDefaults = getDefaultRegistrationDataForCountry(countryCode);

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
