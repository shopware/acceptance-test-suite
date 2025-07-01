import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';
import type { Customer } from '../../../../types/ShopwareTypes';

export const Login_a11yAssert = base.extend<{ Login_a11yAssert: Task }, FixtureTypes>({
    Login_a11yAssert: async ({ ShopCustomer, DefaultSalesChannel, StorefrontAccountLogin, StorefrontAccount }, use) => {
        const task = (customCustomer?: Customer) => {
            return async function Login_a11yAssert() {

                const customer = customCustomer ? customCustomer : DefaultSalesChannel.customer;

                await ShopCustomer.goesTo(StorefrontAccountLogin.url());

                /* baseline version
                await StorefrontAccountLogin.emailInput.fill(customer.email);
                await StorefrontAccountLogin.passwordInput.fill(customer.password);
                await StorefrontAccountLogin.loginButton.press('Enter');
                */

                await ShopCustomer.fillsIn(StorefrontAccountLogin.emailInput, customer.email);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.passwordInput, customer.password);
                await ShopCustomer.presses(StorefrontAccountLogin.loginButton, 'Enter');

                await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeVisible();
                
                //note VSCode detects both with Option 1
                //await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeFoo();

                //VSCode is won't detect this with option 2
                //await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toHaveColorATS('green');

            }
        };

        await use(task);
    },
});