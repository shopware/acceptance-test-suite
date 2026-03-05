import { test as base } from "@playwright/test";
import type { FixtureTypes } from "../types/FixtureTypes";

import { Home } from "./storefront/Home";
import { ProductDetail } from "./storefront/ProductDetail";
import { Category } from "./storefront/Category";
import { CheckoutCart } from "./storefront/CheckoutCart";
import { OffCanvasCart } from "./storefront/OffCanvasCart";
import { CheckoutConfirm } from "./storefront/CheckoutConfirm";
import { CheckoutFinish } from "./storefront/CheckoutFinish";
import { CheckoutRegister } from "./storefront/CheckoutRegister";
import { Account } from "./storefront/Account";
import { AccountLogin } from "./storefront/AccountLogin";
import { AccountRecover } from "./storefront/AccountRecover";
import { AccountProfile } from "./storefront/AccountProfile";
import { AccountOrder } from "./storefront/AccountOrder";
import { AccountAddresses } from "./storefront/AccountAddresses";
import { AccountPayment } from "./storefront/AccountPayment";
import { Search } from "./storefront/Search";
import { SearchSuggest } from "./storefront/SearchSuggest";
import { CustomRegister } from "./storefront/CustomRegister";
import { CheckoutOrderEdit } from "./storefront/CheckoutOrderEdit";
import { AccountAddressCreate } from "./storefront/AccountAddresssCreate";
import { AccountAddressDetails } from "./storefront/AccountAddressDetails";
import { PageNotFound } from "./storefront/PageNotFound";
import { ContactForm } from "./storefront/ContactForm";
import { Wishlist } from "./storefront/Wishlist";
import { Footer } from "./storefront/Footer";
import { Header } from "./storefront/Header";

export interface StorefrontPageTypes {
    StorefrontHome: Home;
    StorefrontProductDetail: ProductDetail;
    StorefrontCategory: Category;
    StorefrontCheckoutCart: CheckoutCart;
    StorefrontOffCanvasCart: OffCanvasCart;
    StorefrontCheckoutConfirm: CheckoutConfirm;
    StorefrontCheckoutFinish: CheckoutFinish;
    StorefrontCheckoutRegister: CheckoutRegister;
    StorefrontAccount: Account;
    StorefrontAccountLogin: AccountLogin;
    StorefrontAccountRecover: AccountRecover;
    StorefrontAccountProfile: AccountProfile;
    StorefrontAccountOrder: AccountOrder;
    StorefrontAccountAddresses: AccountAddresses;
    StorefrontAccountAddressCreate: AccountAddressCreate;
    StorefrontAccountAddressDetails: AccountAddressDetails;
    StorefrontAccountPayment: AccountPayment;
    StorefrontSearch: Search;
    StorefrontSearchSuggest: SearchSuggest;
    StorefrontCustomRegister: CustomRegister;
    StorefrontCheckoutOrderEdit: CheckoutOrderEdit;
    StorefrontPageNotFound: PageNotFound;
    StorefrontContactForm: ContactForm;
    StorefrontWishlist: Wishlist;
    StorefrontFooter: Footer;
    StorefrontHeader: Header;
}

export const StorefrontPageObjects = {
    Home,
    ProductDetail,
    Category,
    CheckoutCart,
    OffCanvasCart,
    CheckoutConfirm,
    CheckoutFinish,
    CheckoutRegister,
    Account,
    AccountLogin,
    AccountRecover,
    AccountProfile,
    AccountOrder,
    AccountAddresses,
    AccountAddressCreate,
    AccountAddressDetails,
    AccountPayment,
    Search,
    SearchSuggest,
    CustomRegister,
    CheckoutOrderEdit,
    PageNotFound,
    ContactForm,
    Wishlist,
    Footer,
    Header,
};

export const test = base.extend<FixtureTypes>({
    StorefrontHome: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new Home(StorefrontPage, InstanceMeta));
    },

    StorefrontProductDetail: async ({ StorefrontPage }, use) => {
        await use(new ProductDetail(StorefrontPage));
    },

    StorefrontCategory: async ({ StorefrontPage }, use) => {
        await use(new Category(StorefrontPage));
    },

    StorefrontCheckoutCart: async ({ StorefrontPage }, use) => {
        await use(new CheckoutCart(StorefrontPage));
    },

    StorefrontOffCanvasCart: async ({ StorefrontPage }, use) => {
        await use(new OffCanvasCart(StorefrontPage));
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

    StorefrontAccount: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new Account(StorefrontPage, InstanceMeta));
    },

    StorefrontAccountLogin: async ({ StorefrontPage }, use) => {
        await use(new AccountLogin(StorefrontPage));
    },

    StorefrontAccountRecover: async ({ StorefrontPage }, use) => {
        await use(new AccountRecover(StorefrontPage));
    },

    StorefrontAccountProfile: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new AccountProfile(StorefrontPage, InstanceMeta));
    },

    StorefrontAccountOrder: async ({ StorefrontPage }, use) => {
        await use(new AccountOrder(StorefrontPage));
    },

    StorefrontAccountAddresses: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new AccountAddresses(StorefrontPage, InstanceMeta));
    },

    /** 
    * @deprecated - Use StorefrontAccountAddressDetails instead. 
    */
    StorefrontAccountAddressCreate: async ({ StorefrontPage }, use) => {
        await use(new AccountAddressCreate(StorefrontPage));
    },

    StorefrontAccountAddressDetails: async ({ StorefrontPage }, use) => {
        await use(new AccountAddressDetails(StorefrontPage));
    },

    StorefrontAccountPayment: async ({ StorefrontPage }, use) => {
        await use(new AccountPayment(StorefrontPage));
    },

    StorefrontSearch: async ({ StorefrontPage }, use) => {
        await use(new Search(StorefrontPage));
    },

    StorefrontSearchSuggest: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new SearchSuggest(StorefrontPage, InstanceMeta));
    },

    StorefrontCustomRegister: async ({ StorefrontPage }, use) => {
        await use(new CustomRegister(StorefrontPage));
    },

    StorefrontCheckoutOrderEdit: async ({ StorefrontPage }, use) => {
        await use(new CheckoutOrderEdit(StorefrontPage));
    },

    StorefrontPageNotFound: async ({ StorefrontPage }, use) => {
        await use(new PageNotFound(StorefrontPage));
    },

    StorefrontContactForm: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new ContactForm(StorefrontPage, InstanceMeta));
    },

    StorefrontWishlist: async ({ StorefrontPage, InstanceMeta }, use) => {
        await use(new Wishlist(StorefrontPage, InstanceMeta));
    },

    StorefrontFooter: async ({ StorefrontPage }, use) => {
        await use(new Footer(StorefrontPage));
    },

    StorefrontHeader: async ({ StorefrontPage }, use) => {
        await use(new Header(StorefrontPage));
    },
});
