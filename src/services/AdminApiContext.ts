import { request } from '@playwright/test';
import { TokenManager, AuthOptions } from './TokenManager';

export interface AdminApiContextOptions extends AuthOptions {
    default_headers?: Record<string, string>;
    ignoreHTTPSErrors?: boolean;
    max_retries?: number;
    retry_base_ms?: number;
}

export class AdminApiContext {
    private readonly options: AdminApiContextOptions;
    private readonly tokenManager: TokenManager;
    private ctx!: any;

    private constructor(options: AdminApiContextOptions) {
        this.options = options;
        this.tokenManager = TokenManager.create(options);
    }

    /** Create from explicit options */
    static async create(options?: Partial<AdminApiContextOptions>): Promise<AdminApiContext> {
        const defaults: AdminApiContextOptions = {
            app_url: process.env.APP_URL!,
            client_id: process.env.ADMIN_CLIENT_ID,
            client_secret: process.env.ADMIN_CLIENT_SECRET,
            admin_username: process.env.ADMIN_USERNAME,
            admin_password: process.env.ADMIN_PASSWORD,
            scope: process.env.ADMIN_SCOPE,
            default_headers: { 'x-requested-with': 'playwright-tests' },
            ignoreHTTPSErrors: true,
            max_retries: 2,
            retry_base_ms: 200,
        };

        const merged = { ...defaults, ...(options ?? {}) };
        const ctx = new AdminApiContext(merged);
        await ctx.init();
        return ctx;
    }

    private async init() {
        this.ctx = await request.newContext({
            baseURL: this.options.app_url.replace(/\/+$/, ''),
            extraHTTPHeaders: this.options.default_headers,
            ignoreHTTPSErrors: this.options.ignoreHTTPSErrors ?? true,
        });
    }

    async dispose() {
        await this.ctx.dispose();
    }

    // --- simple convenience methods ---
    get(url: string, opt: any = {}) { return this.send('GET', url, opt); }
    post(url: string, opt: any = {}) { return this.send('POST', url, opt); }
    put(url: string, opt: any = {}) { return this.send('PUT', url, opt); }
    patch(url: string, opt: any = {}) { return this.send('PATCH', url, opt); }
    delete(url: string, opt: any = {}) { return this.send('DELETE', url, opt); }

    private async send(method: string, url: string, opt: any) {
        const token = await this.tokenManager.getValidAccessToken();
        const res = await this.ctx.fetch(url, {
            method,
            data: opt.data,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(opt.headers ?? {}),
            },
        });

        if (res.status() === 401 || res.status() === 403) {
            await this.tokenManager.forceRefresh();
            return this.ctx.fetch(url, {
                method,
                data: opt.data,
                headers: {
                    Authorization: `Bearer ${await this.tokenManager.getValidAccessToken()}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...(opt.headers ?? {}),
                },
            });
        }

        return res;
    }
}
