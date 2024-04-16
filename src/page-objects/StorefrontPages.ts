import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { Home } from './storefront/Home';
import { ProductDetail } from './storefront/ProductDetail';
import { CheckoutCart } from './storefront/CheckoutCart';
import { CheckoutConfirm } from './storefront/CheckoutConfirm';
import { CheckoutFinish } from './storefront/CheckoutFinish';
import { CheckoutRegister } from './storefront/CheckoutRegister';
import { Account } from './storefront/Account';
import { AccountLogin } from './storefront/AccountLogin';
import { AccountOrder } from './storefront/AccountOrder';
import { Search } from './storefront/Search';
import { SearchSuggest } from './storefront/SearchSuggest';

export interface StorefrontPageTypes {
    StorefrontHome: Home;
    StorefrontProductDetail: ProductDetail;
    StorefrontCheckoutCart: CheckoutCart;
    StorefrontCheckoutConfirm: CheckoutConfirm;
    StorefrontCheckoutFinish: CheckoutFinish;
    StorefrontCheckoutRegister: CheckoutRegister;
    StorefrontAccount: Account;
    StorefrontAccountLogin: AccountLogin;
    StorefrontAccountOrder: AccountOrder;
    StorefrontSearch: Search;
    StorefrontSearchSuggest: SearchSuggest;
}

export const StorefrontPageObjects = {
    Home,
    ProductDetail,
    CheckoutCart,
    CheckoutConfirm,
    CheckoutFinish,
    CheckoutRegister,
    Account,
    AccountLogin,
    AccountOrder,
    Search,
    SearchSuggest,
}

export const test = base.extend<FixtureTypes>({

    StorefrontHome: async ({ StorefrontPage }, use) => {
        await use(new Home(StorefrontPage));
    },

    StorefrontProductDetail: async ({ StorefrontPage, ProductData }, use) => {
        await use(new ProductDetail(StorefrontPage, ProductData));
    },

    StorefrontCheckoutCart: async ({ StorefrontPage }, use) => {
        await use(new CheckoutCart(StorefrontPage));
    },

    StorefrontCheckoutConfirm: async ({ StorefrontPage }, use) => {
        await use(new CheckoutConfirm(StorefrontPage));
    },

    StorefrontCheckoutFinish: async ({ StorefrontPage }, use) => {
        await use(new CheckoutFinish(StorefrontPage));
    },

    StorefrontCheckoutRegister: async ({ StorefrontPage }, use) => {
        await use(new CheckoutRegister(StorefrontPage));
    },

    StorefrontAccount: async ({ StorefrontPage }, use) => {
        await use(new Account(StorefrontPage));
    },

    StorefrontAccountLogin: async ({ StorefrontPage }, use) => {
        await use(new AccountLogin(StorefrontPage));
    },

    StorefrontAccountOrder: async ({ StorefrontPage }, use) => {
        await use(new AccountOrder(StorefrontPage));
    },

    StorefrontSearch: async ({ StorefrontPage }, use) => {
        await use(new Search(StorefrontPage));
    },

    StorefrontSearchSuggest: async ({ StorefrontPage }, use) => {
        await use(new SearchSuggest(StorefrontPage));
    },
});
