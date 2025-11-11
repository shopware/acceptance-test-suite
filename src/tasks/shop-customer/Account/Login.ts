import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import type { Customer } from '../../../types/ShopwareTypes';

export const Login = base.extend<{ Login: Task }, FixtureTypes>({
    Login: async ({ ShopCustomer, DefaultSalesChannel, StorefrontAccountLogin, StorefrontAccount }, use) => {
        const task = (customCustomer?: Customer) => {
            return async function Login() {

                const customer = customCustomer ? customCustomer : DefaultSalesChannel.customer;

                await ShopCustomer.goesTo(StorefrontAccountLogin.url());
                
                await ShopCustomer.fillsIn(StorefrontAccountLogin.emailInput, customer.email);
                await ShopCustomer.fillsIn(StorefrontAccountLogin.passwordInput, customer.password);
                await ShopCustomer.presses(StorefrontAccountLogin.loginButton);

                await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeVisible();
            }
        };

        await use(task);
    },
});