import type { AdminApiContext } from "./AdminApiContext";
import type { Customer, SalesChannel, SalesChannelDomain } from "../types/ShopwareTypes";

export type StorefrontTarget = { mode: "generated" } | { mode: "existing"; url: string };

/** Reuse a supplied account; when absent, create and clean up one account per worker. */
export type StorefrontCustomerOptions = { email: string; password: string };

export function getStorefrontCustomerCredentials(env: NodeJS.ProcessEnv = process.env): StorefrontCustomerOptions | undefined {
    const email = env["SMOKE_CUSTOMER_EMAIL"];
    const password = env["SMOKE_CUSTOMER_PASSWORD"];
    if (Boolean(email) !== Boolean(password)) {
        throw new Error("Set both SMOKE_CUSTOMER_EMAIL and SMOKE_CUSTOMER_PASSWORD, or omit both to create a worker customer.");
    }
    return email && password ? { email, password } : undefined;
}

export interface StorefrontWorkerOptions {
    storefrontTarget: StorefrontTarget;
    storefrontCustomer: StorefrontCustomerOptions | undefined;
}

export interface ExistingStorefront {
    domain: SalesChannelDomain;
    salesChannel: SalesChannel;
    language: { id: string; translationCode: { id: string; code: string } };
}

export const STOREFRONT_TYPE_ID = "8a243080f92e4c719546314b577cf82b";

export function normalizeStorefrontUrl(input: string): string {
    let url: URL;
    try {
        url = new URL(input);
    } catch {
        throw new Error("storefrontTarget.url must be an absolute HTTP or HTTPS URL.");
    }
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
        throw new Error("storefrontTarget.url must use HTTP(S), without credentials, query or fragment.");
    }
    url.pathname = url.pathname.replace(/\/+$/, "") + "/";
    return url.href;
}

export function validateStorefrontOptions(target: StorefrontTarget, customer: StorefrontWorkerOptions["storefrontCustomer"]): void {
    if (!target || !["generated", "existing"].includes(target.mode)) {
        throw new Error("storefrontTarget.mode must be generated or existing.");
    }
    if (target.mode === "existing") {
        if (typeof target.url !== "string") throw new Error("Existing mode requires one storefrontTarget.url.");
        normalizeStorefrontUrl(target.url);
    } else if ("url" in target || customer !== undefined) {
        throw new Error("Generated mode does not accept an existing URL or storefrontCustomer.");
    }
    if (customer !== undefined) {
        if (!customer || "mode" in customer || typeof customer.email !== "string" || !customer.email || typeof customer.password !== "string" || !customer.password) {
            throw new Error("storefrontCustomer requires both email and password. Omit credentials to create a worker customer.");
        }
    }
}

async function search<T>(api: AdminApiContext, entity: string, data: object): Promise<T[]> {
    const response = await api.post(`search/${entity}`, { data });
    if (!response.ok()) throw new Error(`Existing storefront ${entity} lookup failed (HTTP ${response.status()}).`);
    const body = (await response.json()) as { data?: T[] };
    if (!Array.isArray(body.data)) throw new Error(`Existing storefront ${entity} lookup returned malformed data.`);
    return body.data;
}

export async function resolveExistingStorefront(api: AdminApiContext, url: string): Promise<ExistingStorefront> {
    const normalized = normalizeStorefrontUrl(url);
    const domains = await search<SalesChannelDomain & { salesChannel?: SalesChannel; language?: ExistingStorefront["language"] }>(api, "sales-channel-domain", {
        limit: 2,
        filter: [{ type: "equalsAny", field: "url", value: [normalized, normalized.replace(/\/$/, "")] }],
        associations: { salesChannel: {}, language: { associations: { translationCode: {} } } },
    });
    if (domains.length !== 1) throw new Error(domains.length ? "Existing storefront domain is ambiguous." : "Existing storefront domain was not found.");
    const domain = domains[0];
    const channel = domain.salesChannel;
    if (!channel || !channel.id || channel.id !== domain.salesChannelId || !channel.accessKey || channel.typeId !== STOREFRONT_TYPE_ID || !channel.active) {
        throw new Error("Existing domain must belong to an active storefront sales channel with an access key.");
    }
    if (
        normalizeStorefrontUrl(domain.url) !== normalized ||
        !domain.currencyId ||
        !domain.languageId ||
        !domain.snippetSetId ||
        !domain.language?.translationCode?.code ||
        !domain.language.translationCode.id ||
        domain.language.id !== domain.languageId
    ) {
        throw new Error("Existing storefront domain has incomplete or inconsistent localization data.");
    }
    for (const field of ["countryId", "paymentMethodId", "shippingMethodId", "customerGroupId", "navigationCategoryId"] as const) {
        if (!channel[field]) throw new Error("Existing storefront channel has incomplete configuration.");
    }
    return { domain, salesChannel: channel, language: domain.language };
}

export async function resolveStorefrontCustomer(api: AdminApiContext, channel: SalesChannel, customer: { email: string; password: string }): Promise<Customer> {
    const customers = await search<Customer & { boundSalesChannelId?: string }>(api, "customer", {
        limit: 2,
        filter: [
            { type: "equals", field: "email", value: customer.email },
            { type: "equals", field: "guest", value: false },
            { type: "equals", field: "active", value: true },
            {
                type: "multi",
                operator: "OR",
                queries: [
                    { type: "equals", field: "boundSalesChannelId", value: null },
                    { type: "equals", field: "boundSalesChannelId", value: channel.id },
                ],
            },
        ],
        associations: { defaultShippingAddress: {}, defaultBillingAddress: {} },
    });
    if (customers.length !== 1) throw new Error("storefrontCustomer must match exactly one active, non-guest account eligible for the selected channel.");
    const account = customers[0];
    if (!account.id || account.active !== true || account.guest || (account.boundSalesChannelId && account.boundSalesChannelId !== channel.id)) {
        throw new Error("storefrontCustomer is not eligible for the selected channel.");
    }
    return { ...account, password: customer.password };
}
