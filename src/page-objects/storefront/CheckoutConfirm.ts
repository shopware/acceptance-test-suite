import type { Page, Locator } from "playwright-core";
import type { PageObject } from "../../types/PageObject";
import { translate } from "../../services/LanguageHelper";

export class CheckoutConfirm implements PageObject {
    public readonly headline: Locator;
    public readonly termsAndConditionsCheckbox: Locator;
    public readonly termsAndConditionsWithLegalGuaranteeRightsLabel: Locator;
    public readonly termsAndConditionsWithLegalGuaranteeRightsCheckbox: Locator;
    public readonly immediateAccessToDigitalProductCheckbox: Locator;
    public readonly grandTotalPrice: Locator;
    public readonly taxPrice: Locator;
    public readonly summaryTaxLabel: Locator;
    public readonly summaryTaxPrice: Locator;
    public readonly submitOrderButton: Locator;
    public readonly termsAutoConfirmedText: Locator;
    public readonly legalGuaranteeNoticeLink: Locator;
    public readonly lineItemGaranLabel: Locator;

    /**
     * Payment and Shipping options
     */
    public readonly paymentMethodRadioGroup: Locator;
    public readonly shippingMethodRadioGroup: Locator;

    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentCashOnDelivery: Locator;
    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentPaidInAdvance: Locator;
    /**  @deprecated - Use 'paymentMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly paymentInvoice: Locator;

    /**  @deprecated - Use 'shippingMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly shippingStandard: Locator;
    /**  @deprecated - Use 'shippingMethodRadioGroup' with selectsRadioButton() instead. */
    public readonly shippingExpress: Locator;

    /**
     * Product details
     */
    public readonly cartLineItemImages: Locator;
    public readonly page: Page;
    public readonly confirmProductTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole("heading", { name: translate("storefront:checkout:confirm.completeOrder") });
        this.termsAndConditionsCheckbox = page.getByLabel(translate("storefront:checkout:confirm.termsAndConditions"));
        this.immediateAccessToDigitalProductCheckbox = page.getByLabel(translate("storefront:checkout:confirm.immediateAccessToDigitalProduct"));
        this.grandTotalPrice = page.locator(`dt:has-text('${translate("storefront:checkout:common.grandTotal")}') + dd`);
        this.taxPrice = page.locator(`dt:text-matches("${translate("storefront:checkout:common.plusVat")} [0-9]\\+\\?${translate("storefront:checkout:common.vatSuffix")}") + dd`);
        this.summaryTaxLabel = page.locator("dt.summary-tax");
        this.summaryTaxPrice = page.locator("dd.summary-tax");
        this.submitOrderButton = page.getByRole("button", { name: translate("storefront:checkout:confirm.submitOrder") });

        this.paymentMethodRadioGroup = page.locator(".checkout-card", { hasText: translate("storefront:checkout:common.paymentMethod") });
        this.shippingMethodRadioGroup = page.locator(".checkout-card", { hasText: translate("storefront:checkout:common.shippingMethod") });

        this.paymentCashOnDelivery = page.getByLabel(translate("storefront:checkout:common.cashOnDelivery"));
        this.paymentPaidInAdvance = page.getByLabel(translate("storefront:checkout:common.paidInAdvance"));
        this.paymentInvoice = page.getByLabel(translate("storefront:checkout:common.invoice"));

        this.shippingStandard = page.getByLabel(translate("storefront:checkout:common.standard"));
        this.shippingExpress = page.getByLabel(translate("storefront:checkout:common.express"));

        this.cartLineItemImages = page.locator(".line-item-img-link");
        this.termsAutoConfirmedText = page.locator(".checkout-confirm-tos-information");

        this.termsAndConditionsWithLegalGuaranteeRightsCheckbox = page.locator("#tos");
        this.termsAndConditionsWithLegalGuaranteeRightsLabel = page.getByLabel(translate("storefront:checkout:confirm.termsAndConditionsWithLegalGuaranteeRights"));
        this.legalGuaranteeNoticeLink = page.locator("#legalGuaranteeNoticeModal a");
        this.lineItemGaranLabel = page.locator(".line-item-garan-label");
        this.confirmProductTable = page.locator(".confirm-product");
    }

    getLineItemByProductName(productName: string): Record<string, Locator> {
        const productLineItem = this.confirmProductTable.locator(".line-item-product", { hasText: productName });
        const productNameLabel = productLineItem.locator(".line-item-label");
        const productTotalPrice = productLineItem.locator(".line-item-total-price-value");
        const taxPrice = productLineItem.locator(".line-item-tax-price");

        return {
            productLineItem: productLineItem,
            productNameLabel: productNameLabel,
            productTotalPrice: productTotalPrice,
            taxPrice: taxPrice,
        };
    }

    getLineItemByPromotionName(promotionName: string): Record<string, Locator> {
        const promotionLineItem = this.confirmProductTable.locator(".line-item-promotion", { hasText: promotionName });
        const promotionNameLabel = promotionLineItem.locator(".line-item-label");
        const promotionTotalPrice = promotionLineItem.locator(".line-item-total-price-value");

        return {
            promotionLineItem: promotionLineItem,
            promotionNameLabel: promotionNameLabel,
            promotionTotalPrice: promotionTotalPrice,
        };
    }

    /**
     * Returns the checkout summary label for a VAT rate, for example "plus 19% VAT".
     */
    vatLabel(rate: number): string {
        return `${translate("storefront:checkout:common.plusVat")} ${rate}${translate("storefront:checkout:common.vatSuffix")}`;
    }

    /**
     * Returns the line-item tax text when prices exclude VAT, for example "excl. VAT £0.00".
     */
    excludedVatText(price: string): string {
        return `${translate("storefront:checkout:common.excludeVat")} ${price}`;
    }

    /**
     * Returns the VAT summary label and amount for a tax rate, for example 19.
     */
    getTaxSummary(rate: number): { label: Locator; price: Locator } {
        const label = this.summaryTaxLabel.filter({ hasText: this.vatLabel(rate) });

        return {
            label,
            price: this.summaryTaxPrice.and(label.locator("+ dd")),
        };
    }

    url() {
        return "checkout/confirm";
    }
}
