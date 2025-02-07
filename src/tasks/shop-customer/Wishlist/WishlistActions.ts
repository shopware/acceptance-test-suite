import { test as base } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes } from '../../../types/FixtureTypes';
import { Product } from '../../../types/ShopwareTypes';

export const AddProductToCartFromWishlist = base.extend<{ AddProductToCartFromWishlist: Task }, FixtureTypes>({
    AddProductToCartFromWishlist: async ({ ShopCustomer, StorefrontWishlist, StorefrontOffCanvasCart }, use) => {
        const task = (ProductData: Product) => {
            return async function AddProductToCart() {
                const listedItem = await StorefrontWishlist.getListingItemByProductId(ProductData.id);
                await listedItem.productAddToShoppingCart.click();
                await StorefrontWishlist.page.waitForResponse((response) => response.url().includes(`checkout/offcanvas`) && response.ok());
                await ShopCustomer.expects(StorefrontOffCanvasCart.itemCount).toBeVisible();
                const offcanvasItem = await StorefrontOffCanvasCart.getLineItemByProductNumber(ProductData.productNumber);
                const itemsPrice = await offcanvasItem.productTotalPriceValue.innerText();
                const expectedPrice = await listedItem.productPrice.innerText();
                ShopCustomer.expects(itemsPrice).toBe(expectedPrice);
            }
        };

        await use(task);
    },
});

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

export const AddProductToWishlist = base.extend<{ AddProductToWishlist: Task }, FixtureTypes>({
    AddProductToWishlist: async ({ StorefrontHome , ShopCustomer}, use) => {
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