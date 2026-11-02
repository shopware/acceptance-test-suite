import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { test as base, expect } from "../src";
import type { Customer, SalesChannel, SalesChannelDomain } from "../src";

// Exercise the real API fixture without contacting a Shopware installation.
const routingTest = base.extend<{}, { routingServer: { appUrl: string; storefrontUrl: string } }>({
    routingServer: [
        async ({}, use) => {
            const server = createServer((request, response) => {
                response.setHeader("Content-Type", "application/json");
                response.setHeader("sw-context-token", "routing-test-token");
                response.end(
                    JSON.stringify({ url: request.url, host: request.headers.host, language: request.headers["sw-language-id"], token: request.headers["sw-context-token"] })
                );
            });
            await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
            const { port } = server.address() as AddressInfo;
            const appUrl = `http://127.0.0.1:${port}/`;
            const previousAppUrl = process.env["APP_URL"];
            process.env["APP_URL"] = appUrl;
            try {
                await use({ appUrl, storefrontUrl: `http://localhost:${port}/de/` });
            } finally {
                if (previousAppUrl === undefined) delete process.env["APP_URL"];
                else process.env["APP_URL"] = previousAppUrl;
                await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
            }
        },
        { scope: "worker" },
    ],
    DefaultSalesChannel: [
        async ({ routingServer }, use) => {
            // Only these sales-channel fields are consumed by the API fixture.
            await use({
                salesChannel: { accessKey: "routing-test-key" } as SalesChannel,
                get customer(): Customer {
                    throw new Error("Customer is not used by Store API routing tests.");
                },
                url: `${routingServer.appUrl}test-generated/`,
            });
        },
        { scope: "worker" },
    ],
});

for (const mode of ["generated", "existing"] as const) {
    const test = routingTest.extend({
        ExistingStorefront: [
            async ({ routingServer }, use) => {
                await use(
                    mode === "existing"
                        ? {
                              domain: { url: routingServer.storefrontUrl, languageId: "domain-language", currencyId: "domain-currency" } as SalesChannelDomain,
                              salesChannel: { accessKey: "routing-test-key" } as SalesChannel,
                              language: { id: "domain-language", translationCode: { id: "locale", code: "de-DE" } },
                          }
                        : undefined
                );
            },
            { scope: "worker" },
        ],
    });

    test(`${mode} Store API uses the correct host and path before and after login`, async ({ StoreApiContext, routingServer }) => {
        const target = new URL(mode === "existing" ? routingServer.storefrontUrl : routingServer.appUrl);
        const expected = {
            url: `${target.pathname}store-api/context`,
            host: target.host,
            ...(mode === "existing" ? { language: "domain-language", token: "routing-test-token" } : {}),
        };
        const beforeLogin = await StoreApiContext.get("context");
        expect(beforeLogin.ok()).toBe(true);
        expect(await beforeLogin.json()).toEqual(expected);

        await StoreApiContext.login({ email: "routing@example.test", password: "local-test-password" });
        const afterLogin = await StoreApiContext.get("context");
        expect(afterLogin.ok()).toBe(true);
        expect(await afterLogin.json()).toEqual({ ...expected, token: "routing-test-token" });
    });
}
