import { mergeTests } from '@playwright/test';

//keyboard
import { AddProductToCart_a11y } from './shop-customer/a11y_poc/keyboard/AddProductToCart_a11y';
import { ConfirmTermsAndConditions_a11y } from './shop-customer/a11y_poc/keyboard/ConfirmTermsAndConditions_a11y';
import { Login_a11y } from './shop-customer/a11y_poc/keyboard/Login_a11y';
import { ProceedFromProductToCheckout_a11y } from './shop-customer/a11y_poc/keyboard/ProceedFromProductToCheckout_a11y';
import { SelectInvoicePaymentOption_a11y } from './shop-customer/a11y_poc/keyboard/SelectInvoicePaymentOption_a11y';
import { SelectStandardShippingOption_a11y } from './shop-customer/a11y_poc/keyboard/SelectStandardShippingOption_a11y';
import { SubmitOrder_a11y } from './shop-customer/a11y_poc/keyboard/SubmitOrder_a11y';

//keyboard plus customAssertions
import { AddProductToCart_a11yAssert } from './shop-customer/a11y_poc/customAssertions/AddProductToCart_a11yAssert';
import { ConfirmTermsAndConditions_a11yAssert } from './shop-customer/a11y_poc/customAssertions/ConfirmTermsAndConditions_a11yAssert';
import { Login_a11yAssert } from './shop-customer/a11y_poc/customAssertions/Login_a11yAssert';
import { ProceedFromProductToCheckout_a11yAssert } from './shop-customer/a11y_poc/customAssertions/ProceedFromProductToCheckout_a11yAssert';
import { SelectInvoicePaymentOption_a11yAssert } from './shop-customer/a11y_poc/customAssertions/SelectInvoicePaymentOption_a11yAssert';
import { SelectStandardShippingOption_a11yAssert } from './shop-customer/a11y_poc/customAssertions/SelectStandardShippingOption_a11yAssert';
import { SubmitOrder_a11yAssert } from './shop-customer/a11y_poc/customAssertions/SubmitOrder_a11yAssert';





import { Login } from './shop-customer/Account/Login';
import { Logout } from './shop-customer/Account/Logout';
import { Register } from './shop-customer/Account/Register';
import { RegisterGuest } from './shop-customer/Account/RegisterGuest';
import { ChangeStorefrontCurrency } from './shop-customer/Account/ChangeStorefrontCurrency';
import { AddNewAddress } from './shop-customer/Account/AddNewAddress';

import { AddProductToCart } from './shop-customer/Product/AddProductToCart';
import { ProceedFromProductToCheckout } from './shop-customer/Product/ProceedFromProductToCheckout';

import { ProceedFromCartToCheckout } from './shop-customer/Cart/ProceedFromCartToCheckout.ts';
import { ChangeProductQuantity } from './shop-customer/Cart/ChangeProductQuantity';
import { ConfirmTermsAndConditions } from './shop-customer/Checkout/ConfirmTermsAndConditions';
import { SelectCashOnDeliveryPaymentOption } from './shop-customer/Checkout/SelectCashOnDeliveryPaymentOption';
import { SelectInvoicePaymentOption } from './shop-customer/Checkout/SelectInvoicePaymentOption';
import { SelectPaidInAdvancePaymentOption } from './shop-customer/Checkout/SelectPaidInAdvancePaymentOption';
import { SelectStandardShippingOption } from './shop-customer/Checkout/SelectStandardShippingOption';
import { SelectExpressShippingOption } from './shop-customer/Checkout/SelectExpressShippingOption';
import { SubmitOrder } from './shop-customer/Checkout/SubmitOrder';

import { OpenSearchResultPage } from './shop-customer/Search/OpenSearchResultPage';
import { OpenSearchSuggestPage } from './shop-customer/Search/OpenSearchSuggestPage';
import { SearchForTerm } from './shop-customer/Search/SearchForTerm';

import { ValidateAccessibility } from './shop-customer/Accessibility/ValidateAccessibility';
import { AddProductToCartFromWishlist, AddProductToWishlist, RemoveProductFromWishlist } from './shop-customer/Wishlist/WishlistActions';

export const test = mergeTests(
    AddProductToCart_a11y,
    ConfirmTermsAndConditions_a11y,
    Login_a11y,
    ProceedFromProductToCheckout_a11y,
    SelectInvoicePaymentOption_a11y,
    SelectStandardShippingOption_a11y,
    SubmitOrder_a11y,
    
    AddProductToCart_a11yAssert,
    ConfirmTermsAndConditions_a11yAssert,
    Login_a11yAssert,
    ProceedFromProductToCheckout_a11yAssert,
    SelectInvoicePaymentOption_a11yAssert,
    SelectStandardShippingOption_a11yAssert,
    SubmitOrder_a11yAssert,
    

    Login,
    Logout,
    Register,
    RegisterGuest,
    ChangeStorefrontCurrency,
    AddNewAddress,
    AddProductToCart,
    ChangeProductQuantity,
    ProceedFromProductToCheckout,
    ProceedFromCartToCheckout,
    ConfirmTermsAndConditions,
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
);
