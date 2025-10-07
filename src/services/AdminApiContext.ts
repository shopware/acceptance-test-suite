import { request } from '@playwright/test';
import type { APIRequestContext, APIResponse } from 'playwright-core';
import { TokenManager, AdminApiAuthOptions } from './TokenManager';

type HTTPHeaders = Record<string, string>;

interface RequestOptions<PAYLOAD> {
    [key: string]: unknown;
    data?: PAYLOAD;
    headers?: HTTPHeaders;
}

export interface AdminApiContextOptions extends AdminApiAuthOptions {
    default_headers?: HTTPHeaders;
    ignoreHTTPSErrors?: boolean;
    max_retries?: number; // for idempotent methods; default 2
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class AdminApiContext {
    private context: APIRequestContext;
    private options: AdminApiContextOptions;
    private tokenManager: TokenManager;

    private static readonly defaultOptions: AdminApiContextOptions = {
        app_url: process.env['ADMIN_API_URL'] || process.env['APP_URL'] || '',
        client_id: process.env['SHOPWARE_ACCESS_KEY_ID'],
        client_secret: process.env['SHOPWARE_SECRET_ACCESS_KEY'],
        admin_username: process.env['SHOPWARE_ADMIN_USERNAME'] || 'admin',
        admin_password: process.env['SHOPWARE_ADMIN_PASSWORD'] || 'shopware',
        ignoreHTTPSErrors: true,
        max_retries: 2,
    };

    private constructor(context: APIRequestContext, options: AdminApiContextOptions) {
        this.context = context;
        this.options = options;
        this.tokenManager = new TokenManager({
            app_url: options.app_url,
            token_endpoint: options.token_endpoint,
            client_id: options.client_id,
            client_secret: options.client_secret,
            admin_username: options.admin_username,
            admin_password: options.admin_password,
            scope: options.scope,
            access_token: options.access_token,
            refresh_token: options.refresh_token,
            expires_in: options.expires_in,
        });
    }

    /** Factory used by the ApiContexts.ts fixture */
    static async create(baseUrl?: string, overrides?: Partial<AdminApiContextOptions>): Promise<AdminApiContext> {
        const merged: AdminApiContextOptions = {
            ...AdminApiContext.defaultOptions,
            ...(overrides ?? {}),
            app_url: (baseUrl || overrides?.app_url || AdminApiContext.defaultOptions.app_url || '').replace(/\/$/, ''),
        };

        const ctx = await request.newContext({
            baseURL: merged.app_url,
            ignoreHTTPSErrors: merged.ignoreHTTPSErrors ?? true,
            extraHTTPHeaders: merged.default_headers ?? {},
        });

        return new AdminApiContext(ctx, merged);
    }

    async dispose(): Promise<void> {
        await this.context.dispose();
    }

    // Convenience verbs
    get<P = unknown>(url: string, options?: RequestOptions<P>)    { return this.request<P>('get', url, options); }
    post<P = unknown>(url: string, options?: RequestOptions<P>)   { return this.request<P>('post', url, options); }
    put<P = unknown>(url: string, options?: RequestOptions<P>)    { return this.request<P>('put', url, options); }
    patch<P = unknown>(url: string, options?: RequestOptions<P>)  { return this.request<P>('patch', url, options); }
    delete<P = unknown>(url: string, options?: RequestOptions<P>) { return this.request<P>('delete', url, options); }

    /** Core request with auth, 401-aware retry, and bounded backoff for 429/5xx. */
    async request<PAYLOAD = unknown>(
        method: HttpMethod,
        url: string,
        options?: RequestOptions<PAYLOAD>,
    ): Promise<APIResponse> {
        const call = async (): Promise<APIResponse> => {
            const token = await this.tokenManager.getValidAccessToken();
            const headers: HTTPHeaders = {
                ...(this.options.default_headers ?? {}),
                ...(options?.headers ?? {}),
                Authorization: `Bearer ${token}`,
            };
            const reqOpts = { ...options, headers };
            return (this.context as any)[method](url, reqOpts);
        };

        let response = await call();

        if (response.status() === 401) {
            // Token likely expired/revoked. Force refresh and retry once.
            await this.tokenManager.forceRefresh();
            response = await call();
        }

        if (this.isTransient(response.status())) {
            response = await this.retryWithBackoff(method, url, options, call);
        }

        return response;
    }

    private isTransient(status: number): boolean {
        return status === 429 || (status >= 500 && status <= 599);
    }

    private isIdempotent(method: HttpMethod): boolean {
        return method === 'get' || method === 'delete';
    }

    private async retryWithBackoff<P>(
        method: HttpMethod,
        url: string,
        options: RequestOptions<P> | undefined,
        call: () => Promise<APIResponse>,
    ): Promise<APIResponse> {
        const maxRetries = this.isIdempotent(method) ? (this.options.max_retries ?? 2) : Math.min(this.options.max_retries ?? 0, 2);
        let attempt = 0;
        let res = await call();
        while (this.isTransient(res.status()) && attempt < maxRetries) {
            const base = 200;
            const delay = Math.min(2000, base * Math.pow(2, attempt)) + Math.floor(Math.random() * 100);
            await new Promise(r => setTimeout(r, delay));
            res = await call();
            attempt++;
        }
        return res;
    }
}
