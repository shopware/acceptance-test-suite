import type { Page, Locator } from "playwright-core";
import { BaseAccount } from "./BaseAccount";
import { translate } from "../../services/LanguageHelper";

export class AccountOrderEdit extends BaseAccount {
    public readonly headline: Locator;
    public readonly paymentMethodRadioGroup: Locator;
    public readonly shippingMethodRadioGroup: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly taxPrice: Locator;
    public readonly completePaymentButton: Locator;

    public readonly editCompletedHeadline: Locator;

    constructor(page: Page) {
        super(page);
        this.headline = page.getByRole("heading", { name: translate("storefront:account:orders.headlineCompletePayment") });
        this.paymentMethodRadioGroup = page.locator(".checkout-card", { hasText: translate("storefront:checkout:common.paymentMethod") });
        this.shippingMethodRadioGroup = page.locator(".checkout-card", { hasText: translate("storefront:checkout:common.shippingMethod") });
        this.grandTotalPrice = page.locator(`dt:has-text('${translate("storefront:checkout:common.grandTotal")}') + dd`);
        this.taxPrice = page.locator(`dt:text-matches("${translate("storefront:checkout:common.plusVat")} [0-9]\\+\\?${translate("storefront:checkout:common.vatSuffix")}") + dd`);
        this.completePaymentButton = page.getByRole("button", { name: translate("storefront:account:orders.buttonCompletePayment") });
        this.editCompletedHeadline = page.getByRole("heading", { name: translate("storefront:account:orders.editCompleted") });
    }

    url(orderId?: string) {
        if (orderId) {
            return `account/order/${orderId}`;
        }
        throw new Error("Order ID is required to build the URL for AccountOrder edit page.");
    }
}
