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
            // thread id seems to be random

            const { id, uuid } = IdProvider.getWorkerDerivedStableId("salesChannel");

            const { uuid: rootCategoryUuid } = IdProvider.getWorkerDerivedStableId("category");
            const { uuid: customerGroupUuid } = IdProvider.getWorkerDerivedStableId("customerGroup");
            const { uuid: domainUuid } = IdProvider.getWorkerDerivedStableId("domain");
            const { uuid: customerUuid } = IdProvider.getWorkerDerivedStableId("customer");

            const baseUrl = `${SalesChannelBaseConfig.appUrl}test-${uuid}/`;

            // get the missing languages ids or all if the sales channel does not exist. This is required for 6.5.x support
            const wantedLanguages = new Set([SalesChannelBaseConfig.currentLanguageId, SalesChannelBaseConfig.defaultLanguageId]);
            const languages: { id: string }[] = [];
            const result = await AdminApiContext.get(`./sales-channel/${uuid}/languages`);
            if (result.ok()) {
                const salesChannelLanguages = (await result.json()) as { data: { id: string }[] };
                wantedLanguages.forEach((l) => {
                    if (!salesChannelLanguages.data.find((i) => i.id === l)) {
                        languages.push({ id: l });
                    }
                });
            } else {
                wantedLanguages.forEach((l) => {
                    languages.push({ id: l });
                });
            }

            const syncResp = await AdminApiContext.post("./_action/sync", {
                data: {
                    "write-sales-channel": {
                        entity: "sales_channel",
                        action: "upsert",
                        payload: [
                            {
                                id: uuid,
                                name: `${id} acceptance test`,
                                typeId: SalesChannelBaseConfig.storefrontTypeId,
                                languageId: SalesChannelBaseConfig.currentLanguageId,

                                currencyId: SalesChannelBaseConfig.currentCurrencyId,
                                paymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
                                shippingMethodId: SalesChannelBaseConfig.defaultShippingMethod,
                                countryId: SalesChannelBaseConfig.currentCountryId,

                                accessKey: "SWSC" + uuid,

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

            const salesChannelPromise = AdminApiContext.get(`./sales-channel/${uuid}`);
            const salutationResponse = await AdminApiContext.get(`./salutation`);
            const salutations = (await salutationResponse.json()) as { data: components["schemas"]["Salutation"][] };

            const customerData = {
                id: customerUuid,
                email: `customer_${id}@example.com`,
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

                salesChannelId: uuid,
                groupId: customerGroupUuid,
                customerNumber: `${customerUuid}`,
                defaultPaymentMethodId: SalesChannelBaseConfig.invoicePaymentMethodId,
            };

            const customerRespPromise = AdminApiContext.post("./customer?_response", {
                data: customerData,
            });

            const [customerResp, salesChannelResp] = await Promise.all([customerRespPromise, salesChannelPromise]);

            expect(customerResp.ok()).toBeTruthy();
            expect(salesChannelResp.ok()).toBeTruthy();

            const customer = (await customerResp.json()) as { data: Customer };
            const salesChannel = (await salesChannelResp.json()) as { data: SalesChannel };

            await use({
                salesChannel: salesChannel.data,
                customer: { ...customer.data, password: customerData.password },
                url: baseUrl,
            });

            const deleteCustomerResponse = await AdminApiContext.delete(`./customer/${customerUuid}`);
            expect(deleteCustomerResponse.ok(), await deleteCustomerResponse.text()).toBeTruthy();

            const deleteSalesChannelResponse = await AdminApiContext.delete(`./sales-channel/${uuid}`);
            expect(deleteSalesChannelResponse.ok(), await deleteSalesChannelResponse.text()).toBeTruthy();

            const deleteCustomerGroupResponse = await AdminApiContext.delete(`./customer-group/${customerGroupUuid}`);
            expect(deleteCustomerGroupResponse.ok(), await deleteCustomerGroupResponse.text()).toBeTruthy();

            const deleteRootCategoryResponse = await AdminApiContext.delete(`./category/${rootCategoryUuid}`);
            expect(deleteRootCategoryResponse.ok(), await deleteRootCategoryResponse.text()).toBeTruthy();
        },
        { scope: "worker" },
    ],
});
