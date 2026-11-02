import { request } from "@playwright/test";
import type { APIRequestContext, APIResponse } from "playwright-core";

type HTTPHeaders = Record<string, string>;

interface RequestOptions<PAYLOAD> {
    [key: string]: unknown;
    data?: PAYLOAD;
}

interface StoreUser {
    email: string;
    password: string;
}

export interface StoreApiContextOptions {
    app_url?: string;
    "sw-access-key"?: string;
    "sw-context-token"?: string;
    "sw-language-id"?: string;
    currencyId?: string;
    ignoreHTTPSErrors?: boolean;
}

export class StoreApiContext {
    private context: APIRequestContext;
    // Keep in-flight requests alive across token changes; dispose every context at teardown.
    private readonly retiredContexts: APIRequestContext[] = [];
    private readonly options: StoreApiContextOptions;

    private static readonly defaultOptions: StoreApiContextOptions = {
        app_url: process.env["APP_URL"],
        ignoreHTTPSErrors: true,
    };

    constructor(context: APIRequestContext, options: StoreApiContextOptions) {
        this.context = context;
        this.options = options;
    }

    public static async create(options?: StoreApiContextOptions) {
        const contextOptions = { ...this.defaultOptions, ...options };

        const instance = new StoreApiContext(await this.createContext(contextOptions), contextOptions);
        if (contextOptions.currencyId) {
            try {
                const response = await instance.patch("context", { data: { currencyId: contextOptions.currencyId } });
                if (!response.ok()) throw new Error(`Store API domain currency initialization failed (HTTP ${response.status()}).`);
                const token = response.headers()["sw-context-token"];
                if (!token) throw new Error("Store API context switch returned no context token.");
                instance.options["sw-context-token"] = token;
                await instance.replaceContext();
            } catch (error) {
                await instance.dispose();
                throw error;
            }
        }
        return instance;
    }

    private static async createContext(options: StoreApiContextOptions) {
        const extraHTTPHeaders: HTTPHeaders = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        if (options["sw-access-key"]) {
            extraHTTPHeaders["sw-access-key"] = options["sw-access-key"];
        }

        if (options["sw-context-token"]) {
            extraHTTPHeaders["sw-context-token"] = options["sw-context-token"];
        }

        if (options["sw-language-id"]) extraHTTPHeaders["sw-language-id"] = options["sw-language-id"];

        return await request.newContext({
            baseURL: `${options["app_url"]?.replace(/\/+$/, "")}/store-api/`,
            ignoreHTTPSErrors: options.ignoreHTTPSErrors,
            extraHTTPHeaders,
        });
    }

    async login(user: StoreUser) {
        const loginResponse = await this.post(`account/login`, {
            data: {
                username: user.email,
                password: user.password,
            },
        });

        const responseHeaders = loginResponse.headers();

        if (!responseHeaders["sw-context-token"]) {
            throw new Error(`Failed to login with user: ${user.email}`);
        }

        this.options["sw-context-token"] = responseHeaders["sw-context-token"];
        await this.replaceContext();

        return responseHeaders;
    }

    private async replaceContext(): Promise<void> {
        const previous = this.context;
        this.context = await StoreApiContext.createContext(this.options);
        this.retiredContexts.push(previous);
    }

    async dispose(): Promise<void> {
        await Promise.all([this.context, ...this.retiredContexts].map((context) => context.dispose()));
        this.retiredContexts.length = 0;
    }

    async get<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.get(url, options);
    }

    async post<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.post(url, options);
    }

    async patch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.patch(url, options);
    }

    async delete<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.delete(url, options);
    }

    async fetch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.fetch(url, options);
    }

    async head<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.context.head(url, options);
    }
}
