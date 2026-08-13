import { test as base } from "@playwright/test";
import type { Task } from "../../../types/Task";
import type { FixtureTypes } from "../../../types/FixtureTypes";
import type { Product } from "../../../types/ShopwareTypes";

export const AddProductToCart = base.extend<{ AddProductToCart: Task }, FixtureTypes>({
    AddProductToCart: async ({ ShopCustomer, StorefrontProductDetail }, use) => {
        const task = (ProductData: Product, quantity = "1") => {
            return async function AddProductToCart() {
                await ShopCustomer.expects(StorefrontProductDetail.addToCartForm).toHaveAttribute("data-add-to-cart-ready", "true");

                // Download products (type on 6.7+, is-download state on 6.5/6.6) with a
                // fixed quantity hide the selector; normal products always show it.
                const isDownloadProduct = ProductData.type === "digital" || (ProductData.states ?? []).includes("is-download");
                const showsQuantitySelect = !(isDownloadProduct && ProductData.maxPurchase === 1);

                if (showsQuantitySelect) {
                    await ShopCustomer.expects(StorefrontProductDetail.quantitySelect).toBeVisible();
                    await ShopCustomer.fillsIn(StorefrontProductDetail.quantitySelect, quantity);
                } else {
                    await ShopCustomer.expects(StorefrontProductDetail.quantitySelect).toBeHidden();
                }
                await ShopCustomer.presses(StorefrontProductDetail.addToCartButton);

                await ShopCustomer.expects(StorefrontProductDetail.offCanvasCartTitle).toBeVisible();
                await ShopCustomer.expects(StorefrontProductDetail.offCanvasCart.getByText(ProductData.name)).toBeVisible();
            };
        };

        await use(task);
    },
});
