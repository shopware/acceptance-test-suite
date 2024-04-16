import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';

export const Logout = base.extend<{ Logout: Task }, FixtureTypes>({
    Logout: async ({ ShopCustomer, StorefrontAccountLogin }, use)=> {
        const task = () => {
            return async function Logout() {

                await ShopCustomer.goesTo(StorefrontAccountLogin);
                await ShopCustomer.expects(StorefrontAccountLogin.loginButton).not.toBeVisible();

                await StorefrontAccountLogin.logoutLink.click();
                await ShopCustomer.expects(StorefrontAccountLogin.successAlert).toBeVisible();
            }
        };

        await use(task);
    },
});
