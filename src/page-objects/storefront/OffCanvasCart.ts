import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class OffCanvasCart implements PageObject {
    public readonly headline: Locator;
    public readonly itemCount: Locator;
    public readonly goToCheckoutButton: Locator;
    public readonly goToCartButton: Locator;
    public readonly continueShoppingButton: Locator;
    public readonly enterPromoInput: Locator;
    public readonly submitDiscountButton: Locator;
    public readonly subTotalPrice: Locator;
    public readonly shippingCosts: Locator;
    public readonly cartQuantityNumber: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole("heading", { name: translate("storefront:checkout:cart.shoppingCart") });
        this.itemCount = page.locator(".offcanvas-cart-header-count");
        this.goToCheckoutButton = page.getByRole("link", { name: translate("storefront:checkout:cart.goToCheckout") });
        this.goToCartButton = page.getByRole("link", { name: translate("storefront:checkout:cart.displayShoppingCart") });
        this.continueShoppingButton = page.getByRole("button", { name: translate("storefront:checkout:cart.continueShopping") });
        this.enterPromoInput = page.locator('input[id="addPromotionOffcanvasCartInput"]');
        this.submitDiscountButton = page.locator("#addPromotionOffcanvasCart");
        this.subTotalPrice = page.locator('dt:has-text("Subtotal") + dd:visible');
        this.shippingCosts = page.locator('dt:has-text("Shipping costs") + dd:visible');
        this.cartQuantityNumber = page.getByLabel(translate("storefront:product:quantity"), { exact: true });
    }

    url() {
        // Off canvas cart is a modal and does not have a url, but the class needs a url method.
        throw new Error("Off Canvas Cart does not have an own url.");
        return "";
    }

    async getLineItemByProductNumber(productNumber: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.locator(".line-item-product", { hasText: productNumber });
        const lineItemImage = lineItem.locator("line-item-img-container");
        const productNameLabel = lineItem.locator(".line-item-label");
        const productNumberLabel = lineItem.locator(".line-item-product-number");
        const productDeliveryDateLabel = lineItem.locator(".line-item-delivery-date");
        const productQuantityMinusButton = lineItem.locator(".btn-minus");
        const productQuantityPlusButton = lineItem.locator(".btn-plus");
        const productQuantityInput = lineItem.locator(".quantity-selector-group-input");
        const productUnitPriceValue = lineItem.locator(".line-item-unit-price-value");
        const productTotalPriceValue = lineItem.locator(".line-item-total-price-value");
        const removeButton = lineItem.locator(".line-item-remove-button");
        const wishlistAddedButton = lineItem.locator(".product-wishlist-added");
        const wishlistNotAddedButton = lineItem.locator(".product-wishlist-not-added");
        const lineItemGaranLabel = lineItem.locator(".line-item-garan-label");

        return {
            lineItemImage: lineItemImage,
            productNameLabel: productNameLabel,
            productNumberLabel: productNumberLabel,
            productDeliveryDateLabel: productDeliveryDateLabel,
            productQuantityMinusButton: productQuantityMinusButton,
            productQuantityPlusButton: productQuantityPlusButton,
            productQuantityInput: productQuantityInput,
            productUnitPriceValue: productUnitPriceValue,
            productTotalPriceValue: productTotalPriceValue,
            removeButton: removeButton,
            wishlistAddedButton: wishlistAddedButton,
            wishlistNotAddedButton: wishlistNotAddedButton,
            lineItemGaranLabel: lineItemGaranLabel,
        };
    }

    async getLineItemByPromotionName(name: string): Promise<Record<string, Locator>> {
        let promotionItem = this.page.locator(".line-item-promotion", { hasText: name });
        const promotionLabel = promotionItem.locator(".line-item-label");
        const promotionPrice = promotionItem.locator(".line-item-total-price-value");

        return {
            promotionLabel: promotionLabel,
            promotionPrice: promotionPrice,
        };
    }
}
