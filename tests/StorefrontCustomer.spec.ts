import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { test as ats, expect, type Customer, type StorefrontWorkerOptions } from "../src";
import type { ExistingStorefront } from "../src/services/StorefrontTarget";
import { getStorefrontCustomerCredentials, resolveStorefrontCustomer, validateStorefrontOptions } from "../src/services/StorefrontTarget";
import type { AdminApiContext } from "../src/services/AdminApiContext";

const channelId = "a".repeat(32);
const borrowedId = "b".repeat(32);
const address = { firstName: "Fixture", lastName: "Customer", city: "Berlin", street: "Test 1", zipcode: "10115", countryId: "c".repeat(32), salutationId: "d".repeat(32) };
const borrowed = {
    id: borrowedId,
    email: "borrowed@example.invalid",
    password: "local-only",
    active: true,
    guest: false,
    boundSalesChannelId: channelId,
    defaultShippingAddress: address,
    defaultBillingAddress: address,
} as Customer;
const storefront = {
    domain: {
        id: "e".repeat(32),
        url: "https://example.invalid/de/",
        salesChannelId: channelId,
        languageId: "f".repeat(32),
        currencyId: "1".repeat(32),
        snippetSetId: "2".repeat(32),
    },
    language: { id: "f".repeat(32), translationCode: { id: "3".repeat(32), code: "de-DE" } },
    salesChannel: {
        id: channelId,
        typeId: "8a243080f92e4c719546314b577cf82b",
        languageId: "f".repeat(32),
        currencyId: "1".repeat(32),
        countryId: address.countryId,
        paymentMethodId: "4".repeat(32),
        shippingMethodId: "5".repeat(32),
        customerGroupId: "6".repeat(32),
        navigationCategoryId: "7".repeat(32),
        accessKey: "local-channel",
        active: true,
        name: "Local",
        homeEnabled: true,
    },
} as ExistingStorefront;
interface State {
    accounts: Map<string, Customer>;
    creates: string[];
    deletes: string[];
    searches: number;
}
const local = ats.extend<{}, { State: State; CustomerProbeUrl: string }>({
    CustomerProbeUrl: [
        async ({}, use) => {
            const server = createServer(async (request, response) => {
                const chunks: Buffer[] = [];
                for await (const chunk of request) chunks.push(Buffer.from(chunk));
                const data = JSON.parse(Buffer.concat(chunks).toString() || "{}");
                const valid = request.url === "/store-api/account/login" && data.password === borrowed.password;
                response.statusCode = valid ? 200 : 401;
                response.setHeader("Content-Type", "application/json");
                if (valid) response.setHeader("sw-context-token", "customer-probe-token");
                response.end("{}");
            });
            await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
            const { port } = server.address() as AddressInfo;
            try {
                await use(`http://127.0.0.1:${port}/`);
            } finally {
                await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
            }
        },
        { scope: "worker" },
    ],
    State: [
        async ({}, use) => {
            await use({ accounts: new Map([[borrowedId, borrowed]]), creates: [], deletes: [], searches: 0 });
        },
        { scope: "worker" },
    ],
    storefrontTarget: [{ mode: "existing", url: storefront.domain.url }, { scope: "worker" }],
    storefrontCustomer: [
        async ({}, use) => {
            await use(undefined);
        },
        { scope: "worker" },
    ],
    ExistingStorefront: [
        async ({ CustomerProbeUrl }, use) => {
            await use({ ...storefront, domain: { ...storefront.domain, url: CustomerProbeUrl } });
        },
        { scope: "worker" },
    ],
    SalesChannelBaseConfig: [
        async ({}, use) => {
            await use({
                storefrontTypeId: storefront.salesChannel.typeId,
                currentLocaleId: "locale",
                currentLanguageId: storefront.domain.languageId,
                currentCurrencyId: storefront.domain.currencyId,
                defaultCurrencyId: storefront.domain.currencyId,
                defaultLanguageId: storefront.domain.languageId,
                invoicePaymentMethodId: "payment",
                defaultShippingMethod: "shipping",
                taxId: "tax",
                currentCountryId: address.countryId,
                currentSnippetSetId: storefront.domain.snippetSetId,
                defaultThemeId: "theme",
                appUrl: "https://example.invalid/",
                adminUrl: "https://example.invalid/admin/",
            });
        },
        { scope: "worker" },
    ],
    AdminApiContext: [
        async ({ State }, use) => {
            const response = (body: unknown, status = 200) => ({ ok: () => status < 400, status: () => status, json: async () => body });
            const api = {
                post: async (path: string, options: { data: any }) => {
                    if (path === "search/customer") {
                        State.searches++;
                        return response({ data: options.data.filter[0].value === borrowed.email ? [State.accounts.get(borrowedId)] : [] });
                    }
                    if (path === "search/salutation") return response({ data: [{ id: address.salutationId }] });
                    if (path === "customer?_response=detail") {
                        const account = options.data as Customer;
                        State.accounts.set(account.id, account);
                        State.creates.push(account.id);
                        return response({ data: account });
                    }
                    throw new Error(`Unexpected mutation or request: ${path}`);
                },
                delete: async (path: string) => {
                    const id = path.replace("customer/", "");
                    State.deletes.push(id);
                    State.accounts.delete(id);
                    return response({});
                },
            } as unknown as AdminApiContext;
            try {
                await use(api);
            } finally {
                expect(State.accounts.has(borrowedId), "borrowed account survives all teardown").toBe(true);
                expect(State.deletes).toEqual(State.creates);
                expect(State.accounts.size).toBe(1);
            }
        },
        { scope: "worker" },
    ],
});
local("missing credentials create one worker-owned account by default", async ({ StorefrontCustomer, DefaultSalesChannel, State }) => {
    expect(StorefrontCustomer).toBeDefined();
    expect(DefaultSalesChannel.customer).toBe(StorefrontCustomer);
    expect(State.searches).toBe(0);
    expect(State.creates).toEqual([StorefrontCustomer!.id]);
});
const reuse = local.extend<{}, StorefrontWorkerOptions>({ storefrontCustomer: [{ email: borrowed.email, password: borrowed.password }, { scope: "worker" }] });
reuse("environment-style credentials borrow a customer without ownership", async ({ StorefrontCustomer, DefaultSalesChannel, State }) => {
    expect(StorefrontCustomer?.id).toBe(borrowedId);
    expect(DefaultSalesChannel.customer).toBe(StorefrontCustomer);
    expect(State.searches).toBe(1);
    expect(State.creates).toEqual([]);
    expect(State.deletes).toEqual([]);
});
const create = local.extend<{}, StorefrontWorkerOptions>({
    storefrontCustomer: [
        async ({}, use) => {
            await use(undefined);
        },
        { scope: "worker" },
    ],
});
create("automatic creation binds one new worker account to the real channel", async ({ StorefrontCustomer, DefaultSalesChannel, State }) => {
    expect(State.creates).toHaveLength(1);
    expect(DefaultSalesChannel.customer).toBe(StorefrontCustomer);
    expect(StorefrontCustomer?.id).not.toBe(borrowedId);
    expect(StorefrontCustomer?.salesChannelId).toBe(channelId);
    expect(StorefrontCustomer?.boundSalesChannelId).toBe(channelId);
    expect(StorefrontCustomer?.languageId).toBe(storefront.domain.languageId);
    expect(State.accounts.has(StorefrontCustomer!.id)).toBe(true);
});
create("subsequent tests reuse the same worker-owned account", async ({ StorefrontCustomer, State }) => {
    expect(State.creates).toEqual([StorefrontCustomer!.id]);
    expect(State.deletes).toEqual([]);
});
create("cleanup keeps the owned identifier even if a consumer mutates the returned account", async ({ StorefrontCustomer }) => {
    StorefrontCustomer!.id = borrowedId;
});
const overridden = local.extend<{}, {}>({
    StorefrontCustomer: [
        async ({ State }, use) => {
            await use(State.accounts.get(borrowedId));
        },
        { scope: "worker" },
    ],
});
overridden("a separate project fixture can supply its own customer", async ({ StorefrontCustomer, DefaultSalesChannel, State }) => {
    expect(DefaultSalesChannel.customer).toBe(StorefrontCustomer);
    expect(StorefrontCustomer?.id).toBe(borrowedId);
    expect(State.searches).toBe(0);
    expect(State.creates).toEqual([]);
});
const generated = local.extend<{}, StorefrontWorkerOptions>({
    storefrontTarget: [{ mode: "generated" }, { scope: "worker" }],
    ExistingStorefront: [
        async ({}, use) => {
            await use(undefined);
        },
        { scope: "worker" },
    ],
});
generated("generated mode has no second customer setup", async ({ StorefrontCustomer, State }) => {
    expect(StorefrontCustomer).toBeUndefined();
    expect(State.creates).toEqual([]);
});
local("conflicting and generated-mode customer choices are rejected", () => {
    expect(() => validateStorefrontOptions({ mode: "existing", url: storefront.domain.url }, { mode: "create", email: "invalid" } as any)).toThrow("requires both");
    expect(() => validateStorefrontOptions({ mode: "generated" }, { email: borrowed.email, password: borrowed.password })).toThrow("Generated mode");
});

local("environment credentials require both values and never need a mode", () => {
    expect(getStorefrontCustomerCredentials({})).toBeUndefined();
    expect(getStorefrontCustomerCredentials({ SMOKE_CUSTOMER_EMAIL: "", SMOKE_CUSTOMER_PASSWORD: "" })).toBeUndefined();
    expect(getStorefrontCustomerCredentials({ SMOKE_CUSTOMER_EMAIL: borrowed.email, SMOKE_CUSTOMER_PASSWORD: borrowed.password })).toEqual({
        email: borrowed.email,
        password: borrowed.password,
    });
    expect(() => getStorefrontCustomerCredentials({ SMOKE_CUSTOMER_EMAIL: borrowed.email })).toThrow("Set both");
    expect(() => getStorefrontCustomerCredentials({ SMOKE_CUSTOMER_PASSWORD: borrowed.password })).toThrow("Set both");
});
local("unresolved existing credentials do not fall back to customer creation", async ({ AdminApiContext, State }) => {
    const before = State.creates.length;
    await expect(resolveStorefrontCustomer(AdminApiContext, storefront.salesChannel, { email: "missing@example.invalid", password: "local" })).rejects.toThrow("exactly one");
    expect(State.creates).toHaveLength(before);
});
const anonymous = local.extend<{}, {}>({
    StorefrontCustomer: [
        async ({}, use) => {
            await use(undefined);
        },
        { scope: "worker" },
    ],
});
anonymous("an explicit project fixture override can retain anonymous browsing", async ({ StorefrontCustomer, DefaultSalesChannel, State }) => {
    expect(StorefrontCustomer).toBeUndefined();
    expect(() => DefaultSalesChannel.customer).toThrow("override StorefrontCustomer");
    expect(State.creates).toEqual([]);
    expect(State.searches).toBe(0);
});

local("wrong supplied passwords fail with an actionable credential error", async ({ CustomerProbeUrl, State }) => {
    const { StoreApiContext } = await import("../src/services/StoreApiContext");
    const api = await StoreApiContext.create({ app_url: CustomerProbeUrl, "sw-access-key": "local-channel" });
    const createsBefore = [...State.creates];
    const deletesBefore = [...State.deletes];
    try {
        await expect(api.login({ email: borrowed.email, password: "wrong-password" })).rejects.toThrow("SHOPWARE_STOREFRONT_CUSTOMER");
        expect(State.creates).toEqual(createsBefore);
        expect(State.deletes).toEqual(deletesBefore);
    } finally {
        await api.dispose();
    }
});
