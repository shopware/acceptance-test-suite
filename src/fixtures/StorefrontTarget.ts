import { test as base } from "@playwright/test";
import type { FixtureTypes } from "../types/FixtureTypes";
import { getStorefrontCustomerCredentials, resolveExistingStorefront, validateStorefrontOptions } from "../services/StorefrontTarget";
import type { ExistingStorefront } from "../services/StorefrontTarget";

export interface StorefrontTargetFixtures {
    ExistingStorefront: ExistingStorefront | undefined;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    storefrontTarget: [{ mode: "generated" }, { option: true, scope: "worker" }],
    storefrontCustomer: [
        async ({ storefrontTarget }, use) => {
            await use(storefrontTarget.mode === "existing" ? getStorefrontCustomerCredentials() : undefined);
        },
        { option: true, scope: "worker" },
    ],
    ExistingStorefront: [
        async ({ storefrontTarget, storefrontCustomer, AdminApiContext }, use) => {
            validateStorefrontOptions(storefrontTarget, storefrontCustomer);
            await use(storefrontTarget.mode === "existing" ? await resolveExistingStorefront(AdminApiContext, storefrontTarget.url) : undefined);
        },
        { scope: "worker" },
    ],
});
