import { test as base } from "@playwright/test";
import type { FixtureTypes } from "../types/FixtureTypes";
import {
    getCountryId,
    getCurrency,
    getLanguageData,
    getPaymentMethodId,
    getShippingMethodId,
    getSnippetSetId,
    getTaxId,
    getThemeId,
    getCountryCodeFromLocale,
    getLanguageCode,
    getLocale,
} from "../services/ShopwareDataHelpers";

export interface Country {
    id: string;
}

export interface Currency {
    id: string;
}

export interface Language {
    id: string;
    translationCode: { id: string };
}

export interface PaymentMethod {
    id: string;
}

export interface ShippingMethod {
    id: string;
}

export interface SnippetSet {
    id: string;
}

export interface Tax {
    id: string;
}

export interface Theme {
    id: string;
}

export interface ShopwareDataFixtureTypes {
    Country: Country;
    Currency: Currency;
    Language: Language;
    PaymentMethod: PaymentMethod;
    ShippingMethod: ShippingMethod;
    SnippetSet: SnippetSet;
    Tax: Tax;
    Theme: Theme;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    Country: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({ id: ExistingStorefront.salesChannel.countryId });
                return;
            }
            const countryCode = getCountryCodeFromLocale(getLocale());
            const countryId = await getCountryId(countryCode, AdminApiContext);

            await use({
                id: countryId,
            });
        },
        { scope: "worker" },
    ],

    Currency: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({ id: ExistingStorefront.domain.currencyId });
                return;
            }
            const currency = await getCurrency(AdminApiContext);

            await use({
                id: currency.id,
            });
        },
        { scope: "worker" },
    ],

    Language: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use(ExistingStorefront.language);
                return;
            }
            const locale = getLocale();
            const languageCode = getLanguageCode(locale);
            const language = await getLanguageData(AdminApiContext, languageCode);

            await use(language);
        },
        { scope: "worker" },
    ],

    PaymentMethod: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({ id: ExistingStorefront.salesChannel.paymentMethodId });
                return;
            }
            const paymentMethodId = await getPaymentMethodId(AdminApiContext);

            await use({
                id: paymentMethodId,
            });
        },
        { scope: "worker" },
    ],

    ShippingMethod: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({ id: ExistingStorefront.salesChannel.shippingMethodId });
                return;
            }
            const shippingMethodId = await getShippingMethodId("Standard", AdminApiContext);

            await use({
                id: shippingMethodId,
            });
        },
        { scope: "worker" },
    ],

    SnippetSet: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({ id: ExistingStorefront.domain.snippetSetId });
                return;
            }
            const snippedSetId = await getSnippetSetId(AdminApiContext);

            await use({
                id: snippedSetId,
            });
        },
        { scope: "worker" },
    ],

    Tax: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                const response = await AdminApiContext.post("search/tax", { data: { limit: 1 } });
                if (!response.ok()) throw new Error(`Tax lookup failed (HTTP ${response.status()}).`);
                const { data } = (await response.json()) as { data: { id: string }[] };
                await use({
                    get id(): string {
                        if (!data?.[0]?.id) throw new Error("No tax is available for test data creation. Override the Tax fixture.");
                        return data[0].id;
                    },
                });
                return;
            }
            const taxId = await getTaxId(AdminApiContext);

            await use({
                id: taxId,
            });
        },
        { scope: "worker" },
    ],

    Theme: [
        async ({ AdminApiContext, ExistingStorefront }, use) => {
            if (ExistingStorefront) {
                await use({
                    get id(): string {
                        throw new Error("Existing storefronts do not have an ATS default theme. Override Theme explicitly if a test needs one.");
                    },
                });
                return;
            }
            const themeId = await getThemeId("Storefront", AdminApiContext);

            await use({
                id: themeId,
            });
        },
        { scope: "worker" },
    ],
});
