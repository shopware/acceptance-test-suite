import { test as base, expect } from "@playwright/test";
import type { FixtureTypes } from "../types/FixtureTypes";
import type { Customer } from "../types/ShopwareTypes";
import { resolveStorefrontCustomer } from "../services/StorefrontTarget";
import { StoreApiContext } from "../services/StoreApiContext";
import { TestDataService } from "../services/TestDataService";

export interface StorefrontCustomerFixtures {
    StorefrontCustomer: Customer | undefined;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    StorefrontCustomer: [
        async ({ ExistingStorefront, storefrontCustomer, AdminApiContext, IdProvider, SalesChannelBaseConfig }, use, workerInfo) => {
            if (!ExistingStorefront) {
                await use(undefined);
                return;
            }
            if (storefrontCustomer) {
                const customer = await resolveStorefrontCustomer(AdminApiContext, ExistingStorefront.salesChannel, storefrontCustomer);
                const probe = await StoreApiContext.create({
                    app_url: ExistingStorefront.domain.url,
                    "sw-access-key": ExistingStorefront.salesChannel.accessKey,
                    "sw-language-id": ExistingStorefront.domain.languageId,
                    httpCredentials: workerInfo.project.use.httpCredentials,
                    userAgent: workerInfo.project.use.userAgent,
                });
                try {
                    await probe.login(storefrontCustomer);
                } finally {
                    await probe.dispose();
                }
                await use(customer);
                return;
            }

            const channel = ExistingStorefront.salesChannel;
            // Use a worker-owned service, not the test-scoped TestDataService fixture:
            // that fixture depends on DefaultSalesChannel and would introduce a cycle.
            const data = new TestDataService(AdminApiContext, IdProvider, {
                defaultSalesChannel: channel,
                borrowedSalesChannel: true,
                defaultTaxId: SalesChannelBaseConfig.taxId,
                defaultCurrencyId: SalesChannelBaseConfig.defaultCurrencyId,
                defaultCategoryId: channel.navigationCategoryId,
                defaultLanguageId: ExistingStorefront.domain.languageId,
                defaultCountryId: channel.countryId,
                defaultCustomerGroupId: channel.customerGroupId,
            });
            const customer = await data.createCustomer({
                active: true,
                languageId: ExistingStorefront.domain.languageId,
                boundSalesChannelId: channel.id,
            });
            const ownedCustomerId = customer.id;
            try {
                await use(customer);
            } finally {
                // Never run general data cleanup against a borrowed channel. Delete only
                // the account created above; borrowed accounts never enter this branch.
                const response = await AdminApiContext.delete(`customer/${ownedCustomerId}`);
                expect(response.ok() || response.status() === 404, `Worker storefront customer cleanup failed (HTTP ${response.status()}).`).toBe(true);
            }
        },
        { scope: "worker" },
    ],
});
