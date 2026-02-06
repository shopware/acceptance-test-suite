import { mergeTests } from "@playwright/test";

import { Login } from "./shop-customer/Account/Login";
import { Logout } from "./shop-customer/Account/Logout";
import { Register } from "./shop-customer/Account/Register";
import { RegisterGuest } from "./shop-customer/Account/RegisterGuest";
import { ChangeStorefrontCurrency } from "./shop-customer/Account/ChangeStorefrontCurrency";
import { AddNewAddress } from "./shop-customer/Account/AddNewAddress";

import { AddProductToCart } from "./shop-customer/Product/AddProductToCart";
import { ProceedFromProductToCheckout } from "./shop-customer/Product/ProceedFromProductToCheckout";
import { CloseTheOffCanvasCart } from "./shop-customer/Cart/CloseTheOffCanvasCart";

import { ProceedFromCartToCheckout } from "./shop-customer/Cart/ProceedFromCartToCheckout.ts";
import { ChangeProductQuantity } from "./shop-customer/Cart/ChangeProductQuantity";
import { ConfirmTermsAndConditions } from "./shop-customer/Checkout/ConfirmTermsAndConditions";
import { SelectPaymentMethod } from "./shop-customer/Checkout/SelectPaymentMethod";
import { SelectCashOnDeliveryPaymentOption } from "./shop-customer/Checkout/SelectCashOnDeliveryPaymentOption";
import { SelectInvoicePaymentOption } from "./shop-customer/Checkout/SelectInvoicePaymentOption";
import { SelectPaidInAdvancePaymentOption } from "./shop-customer/Checkout/SelectPaidInAdvancePaymentOption";
import { SelectShippingMethod } from "./shop-customer/Checkout/SelectShippingMethod";
import { SelectStandardShippingOption } from "./shop-customer/Checkout/SelectStandardShippingOption";
import { SelectExpressShippingOption } from "./shop-customer/Checkout/SelectExpressShippingOption";
import { SubmitOrder } from "./shop-customer/Checkout/SubmitOrder";

import { OpenSearchResultPage } from "./shop-customer/Search/OpenSearchResultPage";
import { OpenSearchSuggestPage } from "./shop-customer/Search/OpenSearchSuggestPage";
import { SearchForTerm } from "./shop-customer/Search/SearchForTerm";

import { ValidateAccessibility } from "./shop-customer/Accessibility/ValidateAccessibility";
import { AddProductToCartFromWishlist, AddProductToWishlist, RemoveProductFromWishlist } from "./shop-customer/Wishlist/WishlistActions";
import { SelectProductFilterOption } from "./shop-customer/Product/SelectProductFilterOption";
import { CheckVisibilityInHome } from "./shop-customer/Listing/CheckVisibilityInHome";

export const test = mergeTests(
    Login,
    Logout,
    Register,
    RegisterGuest,
    ChangeStorefrontCurrency,
    AddNewAddress,
    AddProductToCart,
    CloseTheOffCanvasCart,
    ChangeProductQuantity,
    ProceedFromProductToCheckout,
    ProceedFromCartToCheckout,
    ConfirmTermsAndConditions,
    SelectPaymentMethod,
    SelectShippingMethod,
    SelectInvoicePaymentOption,
    SelectCashOnDeliveryPaymentOption,
    SelectPaidInAdvancePaymentOption,
    SelectStandardShippingOption,
    SelectExpressShippingOption,
    SubmitOrder,
    OpenSearchResultPage,
    OpenSearchSuggestPage,
    SearchForTerm,
    ValidateAccessibility,
    RemoveProductFromWishlist,
    AddProductToCartFromWishlist,
    AddProductToWishlist,
    SelectProductFilterOption,
    CheckVisibilityInHome
);
