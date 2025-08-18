import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';
import type { RegistrationData } from '../../../../types/ShopwareTypes';

export const Register_a11yAssert = base.extend<{ Register_a11yAssert: Task }, FixtureTypes>({
    Register_a11yAssert: async ({ ShopCustomer, StorefrontAccountLogin, IdProvider, TestDataService }, use) => {
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

        const task = (overrides?: Partial<RegistrationData>,
                    /**
                      * @deprecated The 'isCommercial' argument is deprecated and will be removed in a future version. 
                      * Please avoid using it and rely on the `isCommercial` field in `RegistrationData` instead.
                      */
            isCommercial?: boolean) => {
            return async function Register() {
                const registrationData = { ...defaultRegistrationData, ...overrides };

                registeredEmail = registrationData.email;

                /* Actor.presses() works for selecting/activating a dropdown
                * We're cheating a bit because selectOption() still uses a mouse 
                * instead of navigating to the desired option via keyboard
                */
                await ShopCustomer.presses(StorefrontAccountLogin.salutationSelect, 'Space');
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
                await ShopCustomer.presses(StorefrontAccountLogin.countryInput, 'Space');
                await StorefrontAccountLogin.countryInput.selectOption({ label: registrationData.country });

                // checkbox proof of concept - just toggles it on/off
                const checkbox = StorefrontAccountLogin.page.getByRole('checkbox', { name: 'Shipping and billing address do not match.' });
                await ShopCustomer.presses(checkbox, 'Space');
                await ShopCustomer.presses(checkbox, 'Space');

                await ShopCustomer.presses(StorefrontAccountLogin.registerButton, 'Enter');

                const customer = await TestDataService.getCustomerByEmail(registeredEmail);
                if (customer) {
                    TestDataService.addCreatedRecord('customer', customer.id);
                }
            };
        };

        await use(task);
    },
});