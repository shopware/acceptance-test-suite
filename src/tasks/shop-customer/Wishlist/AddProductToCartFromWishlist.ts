import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { Product } from '../../../types/ShopwareTypes';

export const AddProductToCartFromWishlist = base.extend<{ AddProductToCartFromWishlist: Task }, FixtureTypes>({
    AddProductToCartFromWishlist: async ({ ShopCustomer, StorefrontWishlist }, use) => {
        const task = (ProductData: Product) => {
            return async function AddProductToCart() {
                const listedItem = await StorefrontWishlist.getListingItemByProductId(ProductData.id);
                await listedItem.productAddToShoppingCart.click();
                await StorefrontWishlist.page.waitForResponse((response) => response.url().includes(`checkout/offcanvas`) && response.ok());
                await ShopCustomer.expects(StorefrontWishlist.offCanvasCartTitle).toBeVisible();
                await ShopCustomer.expects(StorefrontWishlist.offCanvasCart.getByText(ProductData.name)).toBeVisible();
            }
        };

        await use(task);
    },
});