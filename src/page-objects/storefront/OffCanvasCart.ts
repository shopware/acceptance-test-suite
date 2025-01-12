import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

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
    public readonly promotionSuccessMessage: Locator;
    public readonly promotionErrorMessage: Locator;
    public readonly promotionLineItems: Locator;
    public readonly promotionLineItemLabel: Locator;
    public readonly promotionLineItemDiscount: Locator;

    constructor(public readonly page: Page) {
        this.headline = page.getByRole('heading', { name: 'Shopping cart' });
        this.itemCount = page.locator('.offcanvas-cart-header-count');
        this.goToCheckoutButton = page.getByRole('link', { name: 'Go to checkout' });
        this.goToCartButton = page.getByRole('link', { name: 'Display shopping cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue shopping' });
        this.enterPromoInput = page.locator('input[id="addPromotionOffcanvasCartInput"]');
        this.submitDiscountButton = page.locator('#addPromotionOffcanvasCart');
        this.subTotalPrice = page.locator('dt:has-text("Subtotal") + dd:visible');
        this.shippingCosts = page.locator('dt:has-text("Shipping costs") + dd:visible');
        this.cartQuantityNumber = page.getByLabel('Quantity', { exact: true });
        const offcanvasCart = page.locator('.offcanvas-cart');
        this.promotionSuccessMessage = offcanvasCart.locator('.alert-success');
        this.promotionErrorMessage = offcanvasCart.locator('.alert-danger');
        this.promotionLineItems = offcanvasCart.locator('.line-item-promotion');
        this.promotionLineItemLabel = this.promotionLineItems.locator('.line-item-label');
        this.promotionLineItemDiscount = this.promotionLineItems.locator('.line-item-total-price-value');
        const shippingCostValues = page.locator('.shipping-value');

    }

    url() {
        // Off canvas cart is a modal and does not have a url, but the class needs a url method.
        throw new Error('Off Canvas Cart does not have an own url.');
        return '';
    }

    async getLineItemByProductNumber(productNumber: string): Promise<Record<string, Locator>> {
        const lineItem = this.page.locator('.line-item-product', { hasText: productNumber })
        const lineItemImage = lineItem.locator('line-item-img-container');
        const productNameLabel = lineItem.locator('.line-item-label');
        const productNumberLabel = lineItem.locator('.line-item-product-number');
        const productDeliveryDateLabel = lineItem.locator('.line-item-delivery-date');
        const productQuantityMinusButton = lineItem.locator('.btn-minus');
        const productQuantityPlusButton = lineItem.locator('.btn-plus');
        const productQuantityInput = lineItem.locator('.quantity-selector-group-input');
        const productUnitPriceValue = lineItem.locator('.line-item-unit-price-value');
        const productTotalPriceValue = lineItem.locator('.line-item-total-price-value');
        const removeButton = lineItem.locator('.line-item-remove-button');

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
        }
    }

    async getPromotionLineItemByNameAndDiscount(discount: string, label: string): Promise<Record<string, Locator>> {
        const offCanvasCart = this.page.locator('.offcanvas-cart');
        const promotionLineItem = offCanvasCart.locator('.line-item-promotion', { hasText: discount });
        const promotionLineItemLabel = promotionLineItem.locator('.line-item-label', { hasText: label });
        const promotionIcon = promotionLineItem.locator('.icon-marketing');
        const promotionRemoveButton = promotionLineItem.getByRole('button', { name: 'Remove' });
        const promotionLineItemDiscount = promotionLineItem.locator('.line-item-total-price-value');

        return {
            promotionLineItem: promotionLineItem,
            promotionLineItemLabel: promotionLineItemLabel,
            promotionIcon: promotionIcon,
            promotionRemoveButton: promotionRemoveButton,
            promotionLineItemDiscount: promotionLineItemDiscount,
        }
    }
}
