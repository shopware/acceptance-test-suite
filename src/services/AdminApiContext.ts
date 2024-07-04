import { request, APIResponse, APIRequestContext } from '@playwright/test';

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
        app_url: process.env['APP_URL'],
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
                scope: ['write'],
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
                scope: ['write'],
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