import { request } from '@playwright/test';

export interface AdminApiAuthOptions {
    app_url: string;
    token_endpoint?: string; // default '/oauth/token'
    client_id?: string;
    client_secret?: string;
    admin_username?: string;
    admin_password?: string;
    scope?: string;

    access_token?: string;
    refresh_token?: string;
    expires_in?: number; // seconds
}

type TokenResponse = {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
};

export class TokenEndpointError extends Error {
    status: number;
    data: any;
    constructor(message: string, status: number, data: any) {
        super(message);
        this.name = 'TokenEndpointError';
        this.status = status;
        this.data = data;
    }
}

export class TokenManager {
    private accessToken?: string;
    private refreshToken?: string;
    private expiresAt?: number; // epoch ms
    private inFlight?: Promise<void>;
    private readonly skewMs = 60_000;

    private readonly opts: AdminApiAuthOptions;
    private readonly appUrl: string;
    private readonly tokenEndpoint: string;

    constructor(opts: AdminApiAuthOptions) {
        this.opts = opts;
        this.appUrl = opts.app_url.replace(/\/$/, '');
        this.tokenEndpoint = opts.token_endpoint ?? 'oauth/token';

        if (opts.access_token) this.accessToken = opts.access_token;
        if (opts.refresh_token) this.refreshToken = opts.refresh_token;
        if (opts.expires_in) this.expiresAt = Date.now() + opts.expires_in * 1000;
    }

    async getValidAccessToken(): Promise<string> {
        if (!this.accessToken || this.isExpiring()) {
            await this.refreshWithLock();
        }
        return this.accessToken!;
    }

    async forceRefresh(): Promise<void> {
        await this.refreshWithLock(true);
    }

    private isExpiring(): boolean {
        if (!this.expiresAt) return true;
        return Date.now() >= this.expiresAt - this.skewMs;
    }

    private async refreshWithLock(force = false): Promise<void> {
        if (!this.inFlight) {
            this.inFlight = (async () => {
                await this.refreshOrReauth(force);
            })().finally(() => (this.inFlight = undefined));
        }
        return this.inFlight;
    }

    private async refreshOrReauth(force: boolean): Promise<void> {
        if (!force && this.refreshToken) {
            try {
                await this.tryRefresh();
                return;
            } catch (err) {
                if (!this.isInvalidGrant(err)) throw err;
                // else fall through to reauth
            }
        }
        await this.fullReauth();
    }

    private isInvalidGrant(err: any): boolean {
        const status = err?.status;
        const code = err?.data?.error;
        return status === 400 || status === 401 || code === 'invalid_grant';
    }

    private async tryRefresh(): Promise<void> {
        const form: Record<string, string> = {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken!,
        };
        if (this.opts.client_id) form['client_id'] = this.opts.client_id;
        if (this.opts.client_secret) form['client_secret'] = this.opts.client_secret;
        const res = await this.tokenRequest(form);
        this.setTokens(res);
    }

    private async fullReauth(): Promise<void> {
        const hasClientCreds =
            !!(this.opts.client_id && this.opts.client_secret && !this.opts.admin_username && !this.opts.admin_password);

        let form: Record<string, string>;
        if (hasClientCreds) {
            form = { grant_type: 'client_credentials' };
            if (this.opts.client_id) form['client_id'] = this.opts.client_id;
            if (this.opts.client_secret) form['client_secret'] = this.opts.client_secret;
            if (this.opts.scope) form['scope'] = this.opts.scope;
        } else {
            form = {
                grant_type: 'password',
                username: String(this.opts.admin_username ?? ''),
                password: String(this.opts.admin_password ?? ''),
            };
            if (this.opts.client_id) form['client_id'] = this.opts.client_id;
            if (this.opts.client_secret) form['client_secret'] = this.opts.client_secret;
            if (this.opts.scope) form['scope'] = this.opts.scope;
        }

        const res = await this.tokenRequest(form);
        this.setTokens(res);
    }

    private setTokens(res: TokenResponse) {
        this.accessToken = res.access_token;
        if (res.refresh_token) this.refreshToken = res.refresh_token;
        const ttl = (res.expires_in ?? 300) * 1000;
        this.expiresAt = Date.now() + ttl;
    }

    private async tokenRequest(form: Record<string, string>): Promise<TokenResponse> {
        const ctx = await request.newContext({
            baseURL: this.appUrl,
            extraHTTPHeaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const resp = await ctx.post(this.tokenEndpoint, { form });
        if (!resp.ok()) {
            let data: any = null;
            try {
                data = await resp.json();
            } catch {}
            throw new TokenEndpointError(
                `Token endpoint failed: ${resp.status()} ${resp.statusText()}`,
                resp.status(),
                data,
            );
        }
        return (await resp.json()) as TokenResponse;
    }
}
