import { request, APIResponse, APIRequestContext } from '@playwright/test';

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
    'app_url'?: string;
    'sw-access-key'?: string;
    'sw-context-token'?: string;
    ignoreHTTPSErrors?: boolean;
}

export class StoreApiContext {

    private context: APIRequestContext;
    private readonly options: StoreApiContextOptions;

    private static readonly defaultOptions: StoreApiContextOptions = {
        app_url: process.env['APP_URL'],
        ignoreHTTPSErrors: true,
    };

    constructor(context: APIRequestContext, options: StoreApiContextOptions) {
        this.context = context;
        this.options = options;
    }

    public static async create(options?: StoreApiContextOptions) {
        const contextOptions = { ...this.defaultOptions, ...options };

        return new StoreApiContext(await this.createContext(contextOptions), contextOptions);
    }

    private static async createContext(options: StoreApiContextOptions) {
        const extraHTTPHeaders: HTTPHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (options['sw-access-key']) {
            extraHTTPHeaders['sw-access-key'] = options['sw-access-key'];
        }

        if (options['sw-context-token']) {
            extraHTTPHeaders['sw-context-token'] = options['sw-context-token'];
        }

        return await request.newContext({
            baseURL: `${options['app_url']}store-api/`,
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

        if (!responseHeaders['sw-context-token']) {
            throw new Error(`Failed to login with user: ${user.email}`);
        }

        this.options['sw-context-token'] = responseHeaders['sw-context-token'];
        this.context = await StoreApiContext.createContext(this.options);

        return responseHeaders;
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