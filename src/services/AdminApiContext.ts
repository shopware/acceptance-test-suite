import { expect, request } from "@playwright/test";
import type { APIRequestContext, APIResponse } from "playwright-core";

type HTTPHeaders = Record<string, string>;

interface RequestOptions<PAYLOAD> {
    [key: string]: unknown;
    data?: PAYLOAD;
    headers?: Record<string, string>;
}

export interface AdminApiContextOptions {
    app_url?: string;
    client_id?: string;
    client_secret?: string;
    access_token?: string;
    admin_username?: string;
    admin_password?: string;
    ignoreHTTPSErrors?: boolean;
    authMaxRetries?: number;
    authBaseDelayMs?: number;
    allowIntegrationCreation?: boolean;
}

export class AdminApiContext {
    public context: APIRequestContext;
    // Keep in-flight requests alive across token changes; dispose every context at teardown.
    private readonly retiredContexts: APIRequestContext[] = [];
    public readonly options: Required<AdminApiContextOptions>;

    private static get defaultOptions(): Required<AdminApiContextOptions> {
        return {
            app_url: process.env["ADMIN_API_URL"] || process.env["APP_URL"] || "http://localhost:8000",
            client_id: process.env["SHOPWARE_ACCESS_KEY_ID"] ?? "",
            client_secret: process.env["SHOPWARE_SECRET_ACCESS_KEY"] ?? "",
            admin_username: process.env["SHOPWARE_ADMIN_USERNAME"] || "admin",
            admin_password: process.env["SHOPWARE_ADMIN_PASSWORD"] || "shopware",
            ignoreHTTPSErrors: true,
            authMaxRetries: 2,
            authBaseDelayMs: 250,
            access_token: "",
            allowIntegrationCreation: true,
        };
    }

    constructor(
        context: APIRequestContext,
        options: Required<Omit<AdminApiContextOptions, "allowIntegrationCreation">> & Pick<AdminApiContextOptions, "allowIntegrationCreation">
    ) {
        this.context = context;
        this.options = { allowIntegrationCreation: true, ...options };
    }

    public static async create(options?: AdminApiContextOptions) {
        const contextOptions = {
            ...this.defaultOptions,
            ...options,
        };

        if (!contextOptions.allowIntegrationCreation) {
            if (Boolean(contextOptions.client_id) !== Boolean(contextOptions.client_secret)) {
                throw new Error("Admin API authentication requires a complete integration credential pair.");
            }
            if (!contextOptions.client_id && (!contextOptions.admin_username || !contextOptions.admin_password)) {
                throw new Error("Existing mode requires integration credentials or an Admin username/password pair.");
            }
            const temporaryContext = await this.createApiRequestContext({ ...contextOptions, access_token: "" });
            try {
                contextOptions.access_token = await this.authenticateWithRetry(temporaryContext, contextOptions);
            } finally {
                await temporaryContext.dispose();
            }
            return new AdminApiContext(await this.createApiRequestContext(contextOptions), contextOptions);
        }

        const tmpContext = await this.createApiRequestContext(contextOptions);

        if (!contextOptions.access_token) {
            contextOptions.access_token = await this.authenticateWithRetry(tmpContext, contextOptions);
        }

        if (!contextOptions.client_id) {
            contextOptions["access_token"] = await this.authenticateWithUserPassword(tmpContext, contextOptions);

            const userContext = await this.createApiRequestContext(contextOptions);
            const accessKeyData = (await (await userContext.get("_action/access-key/intergration")).json()) as { accessKey: string; secretAccessKey: string };

            const integrationData = {
                admin: true,
                label: "Playwright Acceptance Test Suite",
                ...accessKeyData,
            };

            await userContext.post("integration", {
                data: integrationData,
            });

            contextOptions.client_id = accessKeyData.accessKey;
            contextOptions.client_secret = accessKeyData.secretAccessKey;
        }

        contextOptions["access_token"] = await this.authenticateWithClientCredentials(tmpContext, contextOptions);
        return new AdminApiContext(await this.createApiRequestContext(contextOptions), contextOptions);
    }

    private static async createApiRequestContext(options: Required<AdminApiContextOptions>): Promise<APIRequestContext> {
        const extraHTTPHeaders: HTTPHeaders = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        if (options.access_token && options.access_token.length) {
            extraHTTPHeaders["Authorization"] = "Bearer " + options.access_token;
        }

        return await request.newContext({
            baseURL: `${options.app_url}api/`,
            ignoreHTTPSErrors: options.ignoreHTTPSErrors,
            extraHTTPHeaders,
        });
    }

    private static async authenticateWithRetry(tmpContext: APIRequestContext, options: Required<AdminApiContextOptions>): Promise<string> {
        const max = Math.max(0, options.authMaxRetries);
        const baseDelay = Math.max(0, options.authBaseDelayMs);

        let lastError: unknown;

        for (let attempt = 0; attempt <= max; attempt++) {
            try {
                if (options.client_id && options.client_secret) {
                    const token = await this.authenticateWithClientCredentials(tmpContext, options);
                    if (token) return token;
                }

                if (options.admin_username && options.admin_password) {
                    const userToken = await this.authenticateWithUserPassword(tmpContext, options);
                    if (userToken) return userToken;
                }

                throw new Error("No valid authentication method available (missing credentials).");
            } catch (err) {
                lastError = err;
                if (attempt === max) break;

                const delay = baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * baseDelay);
                await new Promise((r) => setTimeout(r, delay));
            }
        }

        throw lastError instanceof Error ? lastError : new Error(`Authentication failed after ${max + 1} attempts: ${String(lastError)}`);
    }

    static async authenticateWithClientCredentials(context: APIRequestContext, options: Required<AdminApiContextOptions>) {
        const authResponse: APIResponse = await context.post("oauth/token", {
            data: {
                grant_type: "client_credentials",
                client_id: options.client_id,
                client_secret: options.client_secret,
                scope: "write",
            },
        });

        expect(authResponse.ok(), "Should authenticate with client credentials").toBeTruthy();

        const authData = (await authResponse.json()) as { access_token?: string };

        if (!authData["access_token"]) {
            throw new Error("Failed to authenticate with integration credentials.");
        }

        return authData["access_token"];
    }

    static async authenticateWithUserPassword(context: APIRequestContext, options: Required<AdminApiContextOptions>) {
        const authResponse: APIResponse = await context.post("oauth/token", {
            data: {
                client_id: "administration",
                grant_type: "password",
                username: options.admin_username,
                password: options.admin_password,
                scope: "write",
            },
        });

        expect(authResponse.ok(), "Should authenticate with user credentials").toBeTruthy();

        const authData = (await authResponse.json()) as { access_token?: string };

        if (!authData["access_token"]) {
            throw new Error("Failed to authenticate with Admin credentials.");
        }

        return authData["access_token"];
    }

    private async reauthenticate(): Promise<void> {
        const tmp = await AdminApiContext.createApiRequestContext({
            ...this.options,
            access_token: "",
        });

        try {
            this.options.access_token = await AdminApiContext.authenticateWithRetry(tmp, this.options);
        } finally {
            await tmp.dispose();
        }
        const previous = this.context;
        this.context = await AdminApiContext.createApiRequestContext(this.options);
        this.retiredContexts.push(previous);
    }

    async dispose(): Promise<void> {
        await Promise.all([this.context, ...this.retiredContexts].map((context) => context.dispose()));
        this.retiredContexts.length = 0;
    }

    isAuthenticated(): boolean {
        // TODO: check token expiry
        return !!this.options["access_token"];
    }

    async refreshAccessToken(): Promise<void> {
        if (!this.options.allowIntegrationCreation) {
            await this.reauthenticate();
            return;
        }
        this.options["access_token"] = await AdminApiContext.authenticateWithClientCredentials(this.context, this.options);
        const previous = this.context;
        this.context = await AdminApiContext.createApiRequestContext(this.options);
        this.retiredContexts.push(previous);
    }

    async get<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("get", url, options);
    }

    async post<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("post", url, options);
    }

    async patch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("patch", url, options);
    }

    async delete<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("delete", url, options);
    }

    async fetch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("fetch", url, options);
    }

    async head<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest("head", url, options);
    }

    private async handleRequest<PAYLOAD>(method: "get" | "post" | "patch" | "delete" | "fetch" | "head", url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        const methodMap = {
            get: this.context.get.bind(this.context),
            post: this.context.post.bind(this.context),
            patch: this.context.patch.bind(this.context),
            delete: this.context.delete.bind(this.context),
            fetch: this.context.fetch.bind(this.context),
            head: this.context.head.bind(this.context),
        } as const;

        const withAuth: RequestOptions<PAYLOAD> = {
            ...options,
            data: options?.data ?? undefined,
            headers: {
                ...options?.headers,
                Authorization: `Bearer ${this.options.access_token}`,
            },
        };

        let response = await methodMap[method](url, withAuth);

        if (response.status() === 401 || response.status() === 400) {
            await this.reauthenticate();
            const updatedOptions: RequestOptions<PAYLOAD> = {
                ...options,
                data: options?.data ?? undefined,
                headers: {
                    ...options?.headers,
                    Authorization: `Bearer ${this.options["access_token"]}`,
                },
            };
            response = await this.context[method](url, updatedOptions);
        }

        return response;
    }
}
