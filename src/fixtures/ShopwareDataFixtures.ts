import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';
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
    getCurrencyCodeFromLocale,
    getLanguageCode,
    getLocale,
} from '../services/ShopwareDataHelpers';

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
        async ({ AdminApiContext }, use) => {
            const countryCode = getCountryCodeFromLocale(getLocale());
            const countryId = await getCountryId(countryCode, AdminApiContext);

            await use({
                id: countryId,
            });
        },
        { scope: 'worker' },
    ],

    Currency: [
        async ({ AdminApiContext }, use) => {
            const currency = await getCurrency(AdminApiContext);

            await use({
                id: currency.id,
            });
        },
        { scope: 'worker' },
    ],

    Language: [
        async ({ AdminApiContext }, use) => {
            const locale = getLocale();
            const languageCode = getLanguageCode(locale);
            const language = await getLanguageData(AdminApiContext, languageCode);

            await use(language);
        },
        { scope: 'worker' },
    ],

    PaymentMethod: [
        async ({ AdminApiContext }, use) => {
            const paymentMethodId = await getPaymentMethodId(AdminApiContext);

            await use({
                id: paymentMethodId,
            });
        },
        { scope: 'worker' },
    ],

    ShippingMethod: [
        async ({ AdminApiContext }, use) => {
            const shippingMethodId = await getShippingMethodId('Standard', AdminApiContext);

            await use({
                id: shippingMethodId,
            });
        },
        { scope: 'worker' },
    ],

    SnippetSet: [
        async ({ AdminApiContext }, use) => {
            const snippedSetId = await getSnippetSetId(AdminApiContext);

            await use({
                id: snippedSetId,
            });
        },
        { scope: 'worker' },
    ],

    Tax: [
        async ({ AdminApiContext }, use) => {
            const taxId = await getTaxId(AdminApiContext);

            await use({
                id: taxId,
            });
        },
        { scope: 'worker' },
    ],

    Theme: [
        async ({ AdminApiContext }, use) => {
            const themeId = await getThemeId('Storefront', AdminApiContext);

            await use({
                id: themeId,
            });
        },
        { scope: 'worker' },
    ],
});
