import { validateStorefrontOptions } from "../services/StorefrontTarget";
import { test as base } from "@playwright/test";
import { AdminApiContext } from "../services/AdminApiContext";
import { StoreApiContext } from "../services/StoreApiContext";
import { MailpitApiContext } from "../services/MailpitApiContext";
import type { FixtureTypes } from "../types/FixtureTypes";

export interface ApiContextTypes {
    AdminApiContext: AdminApiContext;
    StoreApiContext: StoreApiContext;
    MailpitApiContext: MailpitApiContext;
}

export const test = base.extend<NonNullable<unknown>, FixtureTypes>({
    AdminApiContext: [
        async ({ storefrontTarget, storefrontCustomer }, use) => {
            validateStorefrontOptions(storefrontTarget, storefrontCustomer);
            const adminApiContext = await AdminApiContext.create({ allowIntegrationCreation: storefrontTarget.mode === "generated" });
            try {
                await use(adminApiContext);
            } finally {
                await adminApiContext.dispose();
            }
        },
        { scope: "worker" },
    ],

    StoreApiContext: [
        async ({ DefaultSalesChannel, ExistingStorefront }, use, workerInfo) => {
            const options = {
                app_url: ExistingStorefront?.domain.url ?? process.env["APP_URL"],
                "sw-access-key": DefaultSalesChannel.salesChannel.accessKey,
                ignoreHTTPSErrors: true,
                "sw-language-id": ExistingStorefront?.domain.languageId,
                currencyId: ExistingStorefront?.domain.currencyId,
                ...(ExistingStorefront ? { httpCredentials: workerInfo.project.use.httpCredentials, userAgent: workerInfo.project.use.userAgent } : {}),
            };

            const storeApiContext = await StoreApiContext.create(options);
            try {
                await use(storeApiContext);
            } finally {
                await storeApiContext.dispose();
            }
        },
        { scope: "worker" },
    ],

    MailpitApiContext: [
        async ({}, use) => {
            const mailpitApiContext = await MailpitApiContext.create(process.env["MAILPIT_BASE_URL"] as string);

            await use(mailpitApiContext);
        },
        { scope: "worker" },
    ],
});
