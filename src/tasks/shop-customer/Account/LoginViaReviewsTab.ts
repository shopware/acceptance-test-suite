import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import type { Customer, Product } from '../../../types/ShopwareTypes';

export const LoginViaReviewsTab = base.extend<{ LoginViaReviewsTab: Task }, FixtureTypes>({
    LoginViaReviewsTab: async ({ ShopCustomer, DefaultSalesChannel, StorefrontProductDetail }, use) => {
        const task = (product: Product, customCustomer?: Customer) => {
            return async function LoginViaReviewsTab() {

                const customer = customCustomer ? customCustomer : DefaultSalesChannel.customer;

                await ShopCustomer.goesTo(StorefrontProductDetail.url(product));
                await StorefrontProductDetail.reviewsTab.click();
                await StorefrontProductDetail.reviewTeaserButton.click();

                await StorefrontProductDetail.reviewEmailInput.fill(customer.email);
                await StorefrontProductDetail.reviewPasswordInput.fill(customer.password);
                await StorefrontProductDetail.reviewLoginButton.click();

                await ShopCustomer.expects(StorefrontProductDetail.productName).toHaveText(product.name);
            }
        };

        await use(task);
    },
});