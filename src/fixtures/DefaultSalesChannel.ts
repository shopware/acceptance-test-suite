import { test as base, expect, APIResponse } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';
import type { components } from '@shopware/api-client/admin-api-types';
import { createHash } from 'crypto';
import {
    getLanguageData,
    getCurrency,
    getPaymentMethodId,
    getDefaultShippingMethodId,
    getTaxId,
    getCountryId,
    getSnippetSetId,
    getThemeId,
} from '../services/ShopwareDataHelpers';

interface StoreBaseConfig {
    storefrontTypeId: string;
    enGBLocaleId: string;
    enGBLanguageId: string;
    eurCurrencyId: string;
    invoicePaymentMethodId: string;
    defaultShippingMethod: string;
    taxId: string;
    deCountryId: string;
    enGBSnippetSetId: string;
    defaultThemeId: string;
    appUrl: string | undefined;
    adminUrl: string;
}

export interface DefaultSalesChannelTypes {
    SalesChannelBaseConfig: StoreBaseConfig;
    DefaultSalesChannel: {
        salesChannel: components['schemas']['SalesChannel'];
        customer: components['schemas']['Customer'] & { password: string };
        url: string;
    }
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({

    SalesChannelBaseConfig: [
        async ({ AdminApiContext }, use) => {
            const requests = {
                language: getLanguageData('en-GB', AdminApiContext),
                currencyEUR: getCurrency('EUR', AdminApiContext),
                invoicePaymentMethodId: getPaymentMethodId(AdminApiContext),
                defaultShippingMethod: getDefaultShippingMethodId(AdminApiContext),
                getTaxId: getTaxId(AdminApiContext),
                deCountryId: getCountryId('de', AdminApiContext),
                enGBSnippetSetId: getSnippetSetId('en-GB', AdminApiContext),
                defaultThemeId: getThemeId('Storefront', AdminApiContext),
            };
            await Promise.all(Object.values(requests));

            const lang = await requests.language;
            const currency = await requests.currencyEUR;

            await use({
                enGBLocaleId: lang.localeId,
                enGBLanguageId: lang.id,
                storefrontTypeId: '8a243080f92e4c719546314b577cf82b',
                eurCurrencyId: currency.id,
                invoicePaymentMethodId: await requests.invoicePaymentMethodId,
                defaultShippingMethod: await requests.defaultShippingMethod,
                taxId: await requests.getTaxId,
                deCountryId: await requests.deCountryId,
                enGBSnippetSetId: await requests.enGBSnippetSetId,
                defaultThemeId: await requests.defaultThemeId,
                appUrl: process.env['APP_URL'],
                adminUrl: process.env['ADMIN_URL'] || `${process.env['APP_URL']}admin/`,
            });
        },
        { scope: 'worker' },
    ],

    DefaultSalesChannel: [
        async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig }, use) => {
            // thread id seems to be random

            const { id, uuid } = IdProvider.getWorkerDerivedStableId('salesChannel');

            const { uuid: rootCategoryUuid } = IdProvider.getWorkerDerivedStableId('category');
            const { uuid: customerGroupUuid } = IdProvider.getWorkerDerivedStableId('customerGroup');
            const { uuid: domainUuid } = IdProvider.getWorkerDerivedStableId('domain');
            const { uuid: customerUuid } = IdProvider.getWorkerDerivedStableId('customer');

            const baseUrl = `${SalesChannelBaseConfig.appUrl}test-${uuid}/`;

            const currentConfigResponse = await AdminApiContext.get(`./_action/system-config?domain=storefront&salesChannelId=${uuid}`);
            const currentConfig = (await currentConfigResponse.json()) as { 'storefront.themeSeed': string } | null;

            await AdminApiContext.delete(`./customer/${customerUuid}`);

            const ordersResp = await AdminApiContext.post(`./search/order`, {
                data: {
                    filter: [{
                        type: 'equals',
                        field: 'salesChannelId',
                        value: uuid,
                    }],
                },
            });

            const orders = (await ordersResp.json()) as { data: { id: string }[] };

            if (orders.data) {
                for (const order of orders.data) {
                    // delete orders
                    const deleteOrderResp = await AdminApiContext.delete(`./order/${order.id}`);
                    expect(deleteOrderResp.ok()).toBeTruthy();
                }
            }

            // fetch all versions
            // delete orders for each version
            const versionsResp = await AdminApiContext.post(`./search/version`);
            expect(versionsResp.ok()).toBeTruthy();

            const versions = (await versionsResp.json()) as { data: { id: string }[] };
            const versionIds = versions.data.map((v) => v.id);

            for (const versionId of versionIds) {
                const ordersResp = await AdminApiContext.post(`./search/order`, {
                    data: {
                        filter: [
                            {
                                type: 'equals',
                                field: 'salesChannelId',
                                value: uuid,
                            },
                        ],
                    },
                    headers: {
                        'sw-version-id': versionId,
                    },
                });

                const orders = (await ordersResp.json()) as { data: { id: string }[] };

                if (orders.data) {
                    for (const order of orders.data) {
                        // delete orders
                        const deleteOrderResp = await AdminApiContext.post(
                            `./_action/version/${versionId}/order/${order.id}`
                        );
                        expect(deleteOrderResp.ok()).toBeTruthy();
                    }
                }
            }

            await AdminApiContext.delete(`./sales-channel/${uuid}`);

            const syncResp = await AdminApiContext.post('./_action/sync', {
                data: {
                    'write-sales-channel': {
                        entity: 'sales_channel',
                        action: 'upsert',
                        payload: [
                            {
                                id: uuid,
                                name: `${id} acceptance test`,
                                typeId: SalesChannelBaseConfig.storefrontTypeId,
                                languageId: SalesChannelBaseConfig.enGBLanguageId,

                                currencyId: SalesChannelBaseConfig.eurCurrencyId,
                                paymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
                                shippingMethodId: SalesChannelBaseConfig.defaultShippingMethod,
                                countryId: SalesChannelBaseConfig.deCountryId,

                                accessKey: 'SWSC' + uuid,

                                homeEnabled: true,

                                navigationCategory: {
                                    id: rootCategoryUuid,
                                    name: `${id} Acceptance test`,
                                    displayNestedProducts: true,
                                    type: 'page',
                                    productAssignmentType: 'product',
                                },

                                domains: [{
                                    id: domainUuid,
                                    url: baseUrl,
                                    languageId: SalesChannelBaseConfig.enGBLanguageId,
                                    snippetSetId: SalesChannelBaseConfig.enGBSnippetSetId,
                                    currencyId: SalesChannelBaseConfig.eurCurrencyId,
                                }],

                                customerGroup: {
                                    id: customerGroupUuid,
                                    name: `${id} Acceptance test`,
                                },

                                languages: [{ id: SalesChannelBaseConfig.enGBLanguageId }],
                                countries: [{ id: SalesChannelBaseConfig.deCountryId }],
                                shippingMethods: [{ id: SalesChannelBaseConfig.defaultShippingMethod }],
                                paymentMethods: [{ id: SalesChannelBaseConfig.invoicePaymentMethodId }],
                                currencies: [{ id: SalesChannelBaseConfig.eurCurrencyId }],
                            },
                        ],
                    },
                    'theme-assignment': {
                        entity: 'theme_sales_channel',
                        action: 'upsert',
                        payload: [{
                            salesChannelId: uuid,
                            themeId: SalesChannelBaseConfig.defaultThemeId,
                        }],
                    },
                },
            });
            expect(syncResp.ok()).toBeTruthy();

            const salesChannelPromise = AdminApiContext.get(`./sales-channel/${uuid}`);

            let themeAssignPromise;

            if (currentConfig && currentConfig['storefront.themeSeed']) {
                // check if theme folder exists
                const md5 = (data: string) => createHash('md5').update(data).digest('hex');

                const md5Str = md5(`${SalesChannelBaseConfig.defaultThemeId}${uuid}${currentConfig['storefront.themeSeed']}`);

                const themeCssResp = await AdminApiContext.head(`${SalesChannelBaseConfig.appUrl}theme/${md5Str}/css/all.css`);

                // if theme all.css exists reuse the seed/theme
                if (themeCssResp.status() === 200) {
                    themeAssignPromise = AdminApiContext.post(`./_action/system-config?salesChannelId=${uuid}`, {
                        data: {
                            'storefront.themeSeed': currentConfig['storefront.themeSeed'],
                        },
                    });
                }
            }

            if (!themeAssignPromise) {
                themeAssignPromise = AdminApiContext.post(
                    `./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${uuid}`
                );
            }

            const salutationResponse = await AdminApiContext.get(`./salutation`);
            const salutations = (await salutationResponse.json()) as { data: components['schemas']['Salutation'][] };

            const customerData = {
                id: customerUuid,
                email: `customer_${id}@example.com`,
                password: 'shopware',
                salutationId: salutations.data[0].id,

                defaultShippingAddress: {
                    firstName: `${id} admin`,
                    lastName: `${id} admin`,
                    city: 'not',
                    street: 'not',
                    zipcode: 'not',
                    countryId: SalesChannelBaseConfig.deCountryId,
                    salutationId: salutations.data[0].id,
                },
                defaultBillingAddress: {
                    firstName: `${id} admin`,
                    lastName: `${id} admin`,
                    city: 'not',
                    street: 'not',
                    zipcode: 'not',
                    countryId: SalesChannelBaseConfig.deCountryId,
                    salutationId: salutations.data[0].id,
                },

                firstName: `${id} admin`,
                lastName: `${id} admin`,

                salesChannelId: uuid,
                groupId: customerGroupUuid,
                customerNumber: `${customerUuid}`,
                defaultPaymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
            };

            const customerRespPromise = AdminApiContext.post('./customer?_response', {
                data: customerData,
            });

            const [customerResp, themeAssignResp, salesChannelResp] = await Promise.all([
                customerRespPromise,
                themeAssignPromise as Promise<APIResponse>,
                salesChannelPromise,
            ]);

            expect(customerResp.ok()).toBeTruthy();
            expect(themeAssignResp.ok()).toBeTruthy();
            expect(salesChannelResp.ok()).toBeTruthy();

            const customer = (await customerResp.json()) as { data: components['schemas']['Customer'] };
            const salesChannel = (await salesChannelResp.json()) as { data: components['schemas']['SalesChannel'] };

            await use({
                salesChannel: salesChannel.data,
                customer: { ...customer.data, password: customerData.password },
                url: baseUrl,
            });
        },
        { scope: 'worker' },
    ],
});
