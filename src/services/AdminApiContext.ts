import { request } from '@playwright/test';
import type { APIRequestContext, APIResponse } from 'playwright-core';

type HTTPHeaders = Record<string, string>;

interface RequestOptions<PAYLOAD> {
    [key: string]: unknown;
    data?: PAYLOAD;
}

export interface AdminApiContextOptions {
    app_url?: string;
    client_id?: string;
    client_secret?: string;
    access_token?: string;
    admin_username?: string;
    admin_password?: string;
    ignoreHTTPSErrors?: boolean;
}

export class AdminApiContext {

    public context: APIRequestContext;
    public readonly options: AdminApiContextOptions;

    private static readonly defaultOptions: AdminApiContextOptions = {
        app_url: process.env['ADMIN_API_URL'] || process.env['APP_URL'],
        client_id: process.env['SHOPWARE_ACCESS_KEY_ID'],
        client_secret: process.env['SHOPWARE_SECRET_ACCESS_KEY'],
        admin_username: process.env['SHOPWARE_ADMIN_USERNAME'] || 'admin',
        admin_password: process.env['SHOPWARE_ADMIN_PASSWORD'] || 'shopware',
        ignoreHTTPSErrors: true,
    };

    constructor(context: APIRequestContext, options: AdminApiContextOptions) {
        this.context = context;
        this.options = options;
    }

    public static async create(options?: AdminApiContextOptions) {
        const contextOptions = { ...this.defaultOptions, ...options };

        const tmpContext = await this.createApiRequestContext(contextOptions);

        if (!contextOptions.client_id) {
            contextOptions['access_token'] = await this.authenticateWithUserPassword(tmpContext, contextOptions);

            const userContext = await this.createApiRequestContext(contextOptions);
            const accessKeyData = await (await userContext.get('_action/access-key/intergration')).json() as { accessKey: string, secretAccessKey: string };

            const integrationData = {
                admin: true,
                label: 'Playwright Acceptance Test Suite',
                ...accessKeyData,
            };

            await userContext.post('integration', {
                data: integrationData,
            });

            contextOptions.client_id = accessKeyData.accessKey;
            contextOptions.client_secret = accessKeyData.secretAccessKey;
        }

        contextOptions['access_token'] = await this.authenticateWithClientCredentials(tmpContext, contextOptions);
        return new AdminApiContext(await this.createApiRequestContext(contextOptions), contextOptions);
    }

    private static async createApiRequestContext(options: AdminApiContextOptions): Promise<APIRequestContext> {
        const extraHTTPHeaders: HTTPHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (options.access_token && options.access_token.length) {
            extraHTTPHeaders['Authorization'] = 'Bearer ' + options.access_token;
        }

        return await request.newContext({
            baseURL: `${options.app_url}api/`,
            ignoreHTTPSErrors: options.ignoreHTTPSErrors,
            extraHTTPHeaders,
        });
    }

    static async authenticateWithClientCredentials(context: APIRequestContext, options: AdminApiContextOptions) {
        const authResponse: APIResponse = await context.post('oauth/token', {
            data: {
                grant_type: 'client_credentials',
                client_id: options.client_id,
                client_secret: options.client_secret,
                scope: 'write',
            },
        });

        const authData = (await authResponse.json()) as { access_token?: string };

        if (!authData['access_token']) {
            throw new Error(`Failed to authenticate with client_id: ${options.client_id}`);
        }

        return authData['access_token'];
    }

    static async authenticateWithUserPassword(context: APIRequestContext, options: AdminApiContextOptions) {
        const authResponse: APIResponse = await context.post('oauth/token', {
            data: {
                client_id: 'administration',
                grant_type: 'password',
                username: options.admin_username,
                password: options.admin_password,
                scope: 'write',
            },
        });

        const authData = (await authResponse.json()) as { access_token?: string };

        if (!authData['access_token']) {
            throw new Error(`Failed to authenticate with user: ${options.admin_username}`);
        }

        return authData['access_token'];
    }

    isAuthenticated(): boolean {
        // TODO: check token expiry
        return !!this.options['access_token'];
    }

    async refreshAccessToken(): Promise<void> {
        this.options['access_token'] = await AdminApiContext.authenticateWithClientCredentials(this.context, this.options);
        this.context = await AdminApiContext.createApiRequestContext(this.options);
    }

    async get<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('get', url, options);
    }

    async post<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('post', url, options);
    }

    async patch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('patch', url, options);
    }

    async delete<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('delete', url, options);
    }

    async fetch<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('fetch', url, options);
    }

    async head<PAYLOAD>(url: string, options?: RequestOptions<PAYLOAD>): Promise<APIResponse> {
        return this.handleRequest('head', url, options);
    }

    private async handleRequest<PAYLOAD>(
      method: 'get' | 'post' | 'patch' | 'delete' | 'fetch' | 'head',
      url: string,
      options?: RequestOptions<PAYLOAD>
    ): Promise<APIResponse> {
        const methodMap = {
            get: this.context.get.bind(this.context),
            post: this.context.post.bind(this.context),
            patch: this.context.patch.bind(this.context),
            delete: this.context.delete.bind(this.context),
            fetch: this.context.fetch.bind(this.context),
            head: this.context.head.bind(this.context),
        };

        let response = await methodMap[method](url, options);

        if (response.status() === 401) {
            await this.refreshAccessToken();
            const updatedOptions: RequestOptions<PAYLOAD> = {
                ...options,
                data: options?.data ?? undefined,
                headers: {
                    ...(options?.headers || {}),
                    Authorization: `Bearer ${this.options['access_token']}`,
                },
            };
            response = await methodMap[method](url, updatedOptions);
        }

        return response;
    }
}
