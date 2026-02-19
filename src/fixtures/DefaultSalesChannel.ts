import { test as base, expect } from "@playwright/test";
import type { FixtureTypes } from "../types/FixtureTypes";
import type { Customer, SalesChannel } from "../types/ShopwareTypes";
import type { components } from "@shopware/api-client/admin-api-types";

interface StoreBaseConfig {
    storefrontTypeId: string;
    currentLocaleId: string;
    currentLanguageId: string;
    currentCurrencyId: string;
    defaultCurrencyId: string;
    defaultLanguageId: string;
    invoicePaymentMethodId: string;
    defaultShippingMethod: string;
    taxId: string;
    currentCountryId: string;
    currentSnippetSetId: string;
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
    };
    DefaultStorefront: {
        salesChannel: SalesChannel;
        customer: Customer;
        url: string;
    };
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    SalesChannelBaseConfig: [
        async ({ Country, Currency, Language, PaymentMethod, ShippingMethod, SnippetSet, Tax, Theme }, use) => {
            await use({
                currentLocaleId: Language.translationCode.id,
                storefrontTypeId: "8a243080f92e4c719546314b577cf82b",
                currentCurrencyId: Currency.id,
                defaultCurrencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
                currentLanguageId: Language.id,
                defaultLanguageId: "2fbb5fe2e29a4d70aa5854ce7ce3e20b",
                invoicePaymentMethodId: PaymentMethod.id,
                defaultShippingMethod: ShippingMethod.id,
                taxId: Tax.id,
                currentCountryId: Country.id,
                currentSnippetSetId: SnippetSet.id,
                defaultThemeId: Theme.id,
                appUrl: process.env["APP_URL"],
                adminUrl: process.env["ADMIN_URL"] || `${process.env["APP_URL"]}admin/`,
            });
        },
        { scope: "worker" },
    ],

    DefaultSalesChannel: [
        async ({ IdProvider, AdminApiContext, SalesChannelBaseConfig }, use) => {
            const { id, uuid } = IdProvider.getWorkerDerivedStableId("salesChannel");
            const salesChannelName = `${id} acceptance test`;

            const { uuid: rootCategoryUuid } = IdProvider.getWorkerDerivedStableId("category");
            const { uuid: customerGroupUuid } = IdProvider.getWorkerDerivedStableId("customerGroup");
            const { uuid: domainUuid } = IdProvider.getWorkerDerivedStableId("domain");
            const { uuid: customerUuid } = IdProvider.getWorkerDerivedStableId("customer");

            const baseUrl = `${SalesChannelBaseConfig.appUrl}test-${uuid}/`;

            // Check if sales channel already exists by name
            const existingSalesChannelResp = await AdminApiContext.post("./search/sales-channel", {
                data: {
                    filter: [
                        {
                            type: "equals",
                            field: "name",
                            value: salesChannelName,
                        },
                    ],
                    associations: {
                        domains: {},
                    },
                    limit: 1,
                },
            });

            let salesChannelUuid = uuid;
            let shouldCreateSalesChannel = true;

            if (existingSalesChannelResp.ok()) {
                const existingData = (await existingSalesChannelResp.json()) as {
                    data: SalesChannel[];
                    total: number;
                };

                if (existingData.total > 0 && existingData.data.length > 0) {
                    // Sales channel exists, use it
                    salesChannelUuid = existingData.data[0].id;
                    shouldCreateSalesChannel = false;
                }
            }

            // Check if customer already exists by email
            const customerEmail = `customer_${id}@example.com`;
            const existingCustomerResp = await AdminApiContext.post("./search/customer", {
                data: {
                    filter: [
                        {
                            type: "equals",
                            field: "email",
                            value: customerEmail,
                        },
                    ],
                    limit: 1,
                },
            });

            let customerUuidToUse = customerUuid;
            let shouldCreateCustomer = true;

            if (existingCustomerResp.ok()) {
                const existingCustomerData = (await existingCustomerResp.json()) as {
                    data: Customer[];
                    total: number;
                };

                if (existingCustomerData.total > 0 && existingCustomerData.data.length > 0) {
                    // Customer exists, use it
                    customerUuidToUse = existingCustomerData.data[0].id;
                    shouldCreateCustomer = false;
                }
            }

            // Create sales channel only if it doesn't exist
            if (shouldCreateSalesChannel) {
                // get the missing languages ids or all if the sales channel does not exist. This is required for 6.5.x support
                const wantedLanguages = new Set([SalesChannelBaseConfig.currentLanguageId, SalesChannelBaseConfig.defaultLanguageId]);
                const languages: { id: string }[] = [];
                wantedLanguages.forEach((l) => {
                    languages.push({ id: l });
                });

                const syncResp = await AdminApiContext.post("./_action/sync", {
                    data: {
                        "write-sales-channel": {
                            entity: "sales_channel",
                            action: "upsert",
                            payload: [
                                {
                                    id: salesChannelUuid,
                                    name: salesChannelName,
                                    typeId: SalesChannelBaseConfig.storefrontTypeId,
                                    languageId: SalesChannelBaseConfig.currentLanguageId,

                                    currencyId: SalesChannelBaseConfig.currentCurrencyId,
                                    paymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
                                    shippingMethodId: SalesChannelBaseConfig.defaultShippingMethod,
                                    countryId: SalesChannelBaseConfig.currentCountryId,

                                    accessKey: "SWSC" + salesChannelUuid,

                                    homeEnabled: true,

                                    navigationCategory: {
                                        id: rootCategoryUuid,
                                        name: `${id} Acceptance test`,
                                        displayNestedProducts: true,
                                        type: "page",
                                        productAssignmentType: "product",
                                    },

                                    domains: [
                                        {
                                            id: domainUuid,
                                            url: baseUrl,
                                            languageId: SalesChannelBaseConfig.currentLanguageId,
                                            snippetSetId: SalesChannelBaseConfig.currentSnippetSetId,
                                            currencyId: SalesChannelBaseConfig.currentCurrencyId,
                                        },
                                    ],

                                    customerGroup: {
                                        id: customerGroupUuid,
                                        name: `${id} Acceptance test`,
                                    },

                                    languages,
                                    countries: [{ id: SalesChannelBaseConfig.currentCountryId }],
                                    shippingMethods: [{ id: SalesChannelBaseConfig.defaultShippingMethod }],
                                    paymentMethods: [{ id: SalesChannelBaseConfig.invoicePaymentMethodId }],
                                    currencies: [{ id: SalesChannelBaseConfig.currentCurrencyId }],
                                },
                            ],
                        },
                    },
                });
                expect(syncResp.ok()).toBeTruthy();
            }

            // Create customer only if it doesn't exist
            let customerData: any;
            if (shouldCreateCustomer) {
                const salutationResponse = await AdminApiContext.get(`./salutation`);
                const salutations = (await salutationResponse.json()) as { data: components["schemas"]["Salutation"][] };

                customerData = {
                    id: customerUuidToUse,
                    email: customerEmail,
                    password: "shopware",
                    salutationId: salutations.data[0].id,
                    languageId: SalesChannelBaseConfig.currentLanguageId,

                    defaultShippingAddress: {
                        firstName: `${id} admin`,
                        lastName: `${id} admin`,
                        city: "not",
                        street: "not",
                        zipcode: "not",
                        countryId: SalesChannelBaseConfig.currentCountryId,
                        salutationId: salutations.data[0].id,
                    },
                    defaultBillingAddress: {
                        firstName: `${id} admin`,
                        lastName: `${id} admin`,
                        city: "not",
                        street: "not",
                        zipcode: "not",
                        countryId: SalesChannelBaseConfig.currentCountryId,
                        salutationId: salutations.data[0].id,
                    },

                    firstName: `${id} admin`,
                    lastName: `${id} admin`,

                    salesChannelId: salesChannelUuid,
                    groupId: customerGroupUuid,
                    customerNumber: `${customerUuidToUse}`,
                    defaultPaymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
                };

                const customerResp = await AdminApiContext.post("./customer?_response", {
                    data: customerData,
                });

                expect(customerResp.ok()).toBeTruthy();
            }

            // Fetch the final sales channel and customer data
            const salesChannelResp = await AdminApiContext.get(`./sales-channel/${salesChannelUuid}`);
            const customerResp = await AdminApiContext.get(`./customer/${customerUuidToUse}`);

            expect(salesChannelResp.ok()).toBeTruthy();
            expect(customerResp.ok()).toBeTruthy();

            const customer = (await customerResp.json()) as { data: Customer };
            const salesChannel = (await salesChannelResp.json()) as { data: SalesChannel };

            await use({
                salesChannel: salesChannel.data,
                customer: { ...customer.data, password: "shopware" },
                url: baseUrl,
            });
        },
        { scope: "worker" },
    ],
});
