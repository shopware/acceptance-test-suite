import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { Product } from '../../../types/ShopwareTypes';

export const AddProductToWishlist = base.extend<{ AddProductToWishlist: Task }, FixtureTypes>({
    AddProductToWishlist: async ({ StorefrontHome , StorefrontWishlist, ShopCustomer}, use) => {
        const task = (ProductData: Product) => {
            return async function AddProductToWishlist() {
                const listedItem = await StorefrontHome.getListingItemByProductId(ProductData.id);
                await listedItem.wishlistNotAddedIcon.click();
                await ShopCustomer.expects(listedItem.wishlistAddedIcon).toBeVisible();
            }
        };

        await use(task);
    },
});