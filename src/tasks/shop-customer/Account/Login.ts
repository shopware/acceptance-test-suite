import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const Login = base.extend<{ Login: Task }, FixtureTypes>({
    Login: async ({ ShopCustomer, DefaultSalesChannel, StorefrontAccountLogin, StorefrontAccount }, use)=> {
        const task = () => {
            return async function Login() {
                const { customer } = DefaultSalesChannel;

                await ShopCustomer.goesTo(StorefrontAccountLogin);

                await StorefrontAccountLogin.emailInput.fill(customer.email);
                await StorefrontAccountLogin.passwordInput.fill(customer.password);
                await StorefrontAccountLogin.loginButton.click();

                await ShopCustomer.expects(StorefrontAccount.personalDataCardTitle).toBeVisible();
            }
        };

        await use(task);
    },
});