import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { Home } from './storefront/Home';
import { ProductDetail } from './storefront/ProductDetail';
import { Category } from './storefront/Category';
import { CheckoutCart } from './storefront/CheckoutCart';
import { CheckoutConfirm } from './storefront/CheckoutConfirm';
import { CheckoutFinish } from './storefront/CheckoutFinish';
import { CheckoutRegister } from './storefront/CheckoutRegister';
import { Account } from './storefront/Account';
import { AccountLogin } from './storefront/AccountLogin';
import { AccountProfile } from './storefront/AccountProfile';
import { AccountOrder } from './storefront/AccountOrder';
import { AccountAddresses } from './storefront/AccountAddresses';
import { AccountPayment } from './storefront/AccountPayment';
import { Search } from './storefront/Search';
import { SearchSuggest } from './storefront/SearchSuggest';

export interface StorefrontPageTypes {
    StorefrontHome: Home;
    StorefrontProductDetail: ProductDetail;
    StorefrontCategory: Category;
    StorefrontCheckoutCart: CheckoutCart;
    StorefrontCheckoutConfirm: CheckoutConfirm;
    StorefrontCheckoutFinish: CheckoutFinish;
    StorefrontCheckoutRegister: CheckoutRegister;
    StorefrontAccount: Account;
    StorefrontAccountLogin: AccountLogin;
    StorefrontAccountProfile: AccountProfile;
    StorefrontAccountOrder: AccountOrder;
    StorefrontAccountAddresses: AccountAddresses;
    StorefrontAccountPayment: AccountPayment;
    StorefrontSearch: Search;
    StorefrontSearchSuggest: SearchSuggest;
}

export const StorefrontPageObjects = {
    Home,
    ProductDetail,
    Category,
    CheckoutCart,
    CheckoutConfirm,
    CheckoutFinish,
    CheckoutRegister,
    Account,
    AccountLogin,
    AccountProfile,
    AccountOrder,
    AccountAddresses,
    AccountPayment,
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

    StorefrontCategory: async ({ StorefrontPage, CategoryData }, use) => {
        await use(new Category(StorefrontPage, CategoryData));
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

    StorefrontAccountProfile: async ({ StorefrontPage }, use) => {
        await use(new AccountProfile(StorefrontPage));
    },

    StorefrontAccountOrder: async ({ StorefrontPage }, use) => {
        await use(new AccountOrder(StorefrontPage));
    },

    StorefrontAccountAddresses: async ({ StorefrontPage }, use) => {
        await use(new AccountAddresses(StorefrontPage));
    },

    StorefrontAccountPayment: async ({ StorefrontPage }, use) => {
        await use(new AccountPayment(StorefrontPage));
    },

    StorefrontSearch: async ({ StorefrontPage }, use) => {
        await use(new Search(StorefrontPage));
    },

    StorefrontSearchSuggest: async ({ StorefrontPage }, use) => {
        await use(new SearchSuggest(StorefrontPage));
    },
});
