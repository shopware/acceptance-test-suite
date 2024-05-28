import { mergeTests } from '@playwright/test';

import { Login } from './shop-customer/Account/Login';
import { Logout } from './shop-customer/Account/Logout';
import { Register } from './shop-customer/Account/Register';

import { AddProductToCart } from './shop-customer/Product/AddProductToCart';
import { ProceedFromProductToCheckout } from './shop-customer/Product/ProceedFromProductToCheckout';

import { ProceedFromCartToCheckout } from './shop-customer/Cart/ProceedFromCartToCheckout.ts';
import { ConfirmTermsAndConditions } from './shop-customer/Checkout/ConfirmTermsAndConditions';
import { SelectCashOnDeliveryPaymentOption } from './shop-customer/Checkout/SelectCashOnDeliveryPaymentOption';
import { SelectInvoicePaymentOption } from './shop-customer/Checkout/SelectInvoicePaymentOption';
import { SelectPaidInAdvancePaymentOption } from './shop-customer/Checkout/SelectPaidInAdvancePaymentOption';
import { SelectStandardShippingOption } from './shop-customer/Checkout/SelectStandardShippingOption';
import { SelectExpressShippingOption } from './shop-customer/Checkout/SelectExpressShippingOption';
import { SubmitOrder } from './shop-customer/Checkout/SubmitOrder';

import { OpenSearchResultPage } from './shop-customer/Search/OpenSearchResultPage';
import { OpenSearchSuggestPage } from './shop-customer/Search/OpenSearchSuggestPage';

import { ValidateAccessibility } from './shop-customer/Accessibility/ValidateAccessibility';

export const test = mergeTests(
    Login,
    Logout,
    Register,
    AddProductToCart,
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
    ValidateAccessibility,
);