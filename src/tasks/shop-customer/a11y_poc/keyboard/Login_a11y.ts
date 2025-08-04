import { test as base } from '@playwright/test';
import type { Task } from '../../../../types/Task';
import type { FixtureTypes} from '../../../../types/FixtureTypes';
import type { Customer } from '../../../../types/ShopwareTypes';

export const Login_a11y = base.extend<{ Login_a11y: Task }, FixtureTypes>({
    Login_a11y: async ({ ShopCustomer, DefaultSalesChannel, StorefrontAccountLogin, StorefrontAccount }, use) => {
        const task = (customCustomer?: Customer) => {
            return async function Login_a11y() {

                const customer = customCustomer ? customCustomer : DefaultSalesChannel.customer;

                await ShopCustomer.goesTo(StorefrontAccountLogin.url());

                await StorefrontAccountLogin.emailInput.fill(customer.email);
                await StorefrontAccountLogin.passwordInput.fill(customer.password);
                await StorefrontAccountLogin.loginButton.press('Enter');

                await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeVisible();
            }
        };

        await use(task);
    },
});