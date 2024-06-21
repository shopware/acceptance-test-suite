import { test as base, expect } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';
import type { Customer, SalesChannel } from '../types/ShopwareTypes';
import type { components } from '@shopware/api-client/admin-api-types';
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
import { isSaaSInstance } from '../services/ShopInfo';

interface StoreBaseConfig {
    storefrontTypeId: string;
    enGBLocaleId: string;
    enGBLanguageId: string;
    eurCurrencyId: string;
    defaultCurrencyId: string;
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
        salesChannel: SalesChannel;
        customer: Customer;
        url: string;
        themeSeed: string | null;
    },
    DefaultStorefront: {
        salesChannel: components['schemas']['SalesChannel'];
        customer: Customer;
        url: string;
    },
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
                defaultCurrencyId: 'b7d2554b0ce847cd82f3ac9bd1c0dfca',
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

            const response = await AdminApiContext.post(`./search/system-config`, {
                data: {
                    page: 1,
                    limit: 1,
                    filter: [
                        {
                            type: 'equals',
                            field: 'salesChannelId',
                            value: uuid,
                        },
                        {
                            type: 'equals',
                            field: 'configurationKey',
                            value: 'storefront.themeSeed',
                        },
                    ],
                },
            });
            const currentConfig = await response.json() as { total: number, data: [{ configurationKey: 'storefront.themeSeed', configurationValue: string }] };
            const themeSeed = currentConfig.total > 0 ? currentConfig.data[0].configurationValue : null;

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
                },
            });
            expect(syncResp.ok()).toBeTruthy();

            if (themeSeed) {
                await AdminApiContext.post('./system-config', {
                    data: {
                        id: uuid,
                        salesChannelId: uuid,
                        configurationKey: 'storefront.themeSeed',
                        configurationValue: themeSeed,
                    },
                });
            }

            const salesChannelPromise = AdminApiContext.get(`./sales-channel/${uuid}`);
            const salutationResponse = await AdminApiContext.get(`./salutation`);
            const salutations = (await salutationResponse.json()) as { data: components['schemas']['Salutation'][] };

            const customerData = {
                id: customerUuid,
                email: `customer_${id}@example.com`,
                password: 'shopware',
                salutationId: salutations.data[0].id,
                languageId: SalesChannelBaseConfig.enGBLanguageId,

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

            const [customerResp, salesChannelResp] = await Promise.all([
                customerRespPromise,
                salesChannelPromise,
            ]);

            expect(customerResp.ok()).toBeTruthy();
            expect(salesChannelResp.ok()).toBeTruthy();

            const customer = (await customerResp.json()) as { data: Customer };
            const salesChannel = (await salesChannelResp.json()) as { data: SalesChannel };

            await use({
                salesChannel: salesChannel.data,
                customer: { ...customer.data, password: customerData.password },
                url: baseUrl,
                themeSeed,
            });
        },
        { scope: 'worker' },
    ],

    DefaultStorefront: [
        async ({ browser, AdminApiContext, DefaultSalesChannel, SalesChannelBaseConfig }, use) => {
            const { id: uuid } = DefaultSalesChannel.salesChannel;
            const isSaasInstance = await isSaaSInstance(AdminApiContext);

            await AdminApiContext.post(
                `./_action/theme/${SalesChannelBaseConfig.defaultThemeId}/assign/${uuid}`
            );

            base.slow();

            if (isSaasInstance) {

                const tmpContext = await browser.newContext();
                const tmpPage = await tmpContext.newPage();

                for (let i = 0; i < 100; ++i) {
                    let latestTimestamp = new Date().toISOString();
                    const response = await AdminApiContext.get(`./notification/message?limit=10&latestTimestamp=${latestTimestamp}`);
                    const json = await response.json() as { notifications: [{ message: string }], timestamp: string };

                    if (json.timestamp) {
                        latestTimestamp = json.timestamp;
                    }

                    if (json.notifications.find(n => n.message.includes(`Compilation for sales channel ${DefaultSalesChannel.salesChannel.name} completed`))) {
                        tmpPage.close();
                        tmpContext.close();

                        break;
                    }

                    // eslint-disable-next-line playwright/no-wait-for-timeout
                    await tmpPage.waitForTimeout(1000);
                }
            }

            await use({
                ...DefaultSalesChannel,
            });
        },
        { scope: 'worker' },
    ],
});
