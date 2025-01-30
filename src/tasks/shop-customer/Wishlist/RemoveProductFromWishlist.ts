import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { Product } from '../../../types/ShopwareTypes';

export const RemoveProductFromWishlist = base.extend<{ RemoveProductFromWishlist: Task }, FixtureTypes>({
    RemoveProductFromWishlist: async ({ StorefrontHome , StorefrontWishlist}, use) => {
        const task = (ProductData: Product) => {
            return async function AddProductToWishlist() {
                const listedItem = await StorefrontHome.getListingItemByProductId(ProductData.id);
                await listedItem.wishlistAddedIcon.click();
                await StorefrontWishlist.page.waitForResponse((response) => response.url().includes(`remove/${ProductData.id}`) && response.ok());
            }
        };

        await use(task);
    },
});