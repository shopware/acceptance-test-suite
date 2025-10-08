import { request } from '@playwright/test';

/**
 * Auth options for Admin API.
 * Provide either a refresh_token or admin credentials so we can reauthenticate
 * if the refresh token becomes invalid.
 */
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

/**
 * A tiny, robust token manager with built-in reauth fallback.
 * - Uses a single-flight lock to avoid concurrent refresh storms.
 * - If refresh fails with invalid_grant/401, falls back to password grant.
 * - Adds a safety window to account for clock skew.
 */
export class TokenManager {
    private readonly opts: AdminApiAuthOptions;
    private accessToken?: string;
    private refreshToken?: string;
    private expiresAt?: number; // epoch ms
    private inflight?: Promise<void>; // single-flight

    private static readonly SKEW_MS = 60_000; // 60s safety window

    constructor(opts: AdminApiAuthOptions) {
        this.opts = opts;
        if (opts.access_token) this.accessToken = opts.access_token;
        if (opts.refresh_token) this.refreshToken = opts.refresh_token;
        if (opts.expires_in) this.setExpiryFromNow(opts.expires_in);
    }

    static create(opts: AdminApiAuthOptions) {
        return new TokenManager(opts);
    }

    async getValidAccessToken(): Promise<string> {
        if (!this.accessToken || this.isExpiring()) {
            await this.refreshWithLock();
        }
        if (!this.accessToken) throw new Error('No access token available after refresh.');
        return this.accessToken;
    }

    async forceRefresh(): Promise<void> {
        await this.refreshWithLock(true);
    }

    private isExpiring(): boolean {
        if (!this.expiresAt) return true;
        return Date.now() >= this.expiresAt - TokenManager.SKEW_MS;
    }

    private setExpiryFromNow(expiresInSeconds: number) {
        this.expiresAt = Date.now() + Math.max(0, expiresInSeconds) * 1000;
    }

    private async refreshWithLock(force = false): Promise<void> {
        if (this.inflight) return this.inflight;
        this.inflight = (async () => {
            try {
                if (!force && this.refreshToken) {
                    const ok = await this.tryRefreshGrant();
                    if (ok) return;
                }
                await this.passwordGrant(); // fallback (reauthenticate)
            } finally {
                this.inflight = undefined;
            }
        })();
        return this.inflight;
    }

    private async tryRefreshGrant(): Promise<boolean> {
        try {
            const res = await request.newContext().then(ctx =>
                ctx.post(this.tokenUrl(), {
                    data: {
                        grant_type: 'refresh_token',
                        refresh_token: this.refreshToken,
                        client_id: this.opts.client_id,
                        client_secret: this.opts.client_secret,
                    },
                    ignoreHTTPSErrors: true,
                }).finally(() => ctx.dispose()),
            );

            if (!res.ok()) {
                // Common failure when refresh token is invalid/expired
                const status = res.status();
                const body = await safeText(res);
                if (status === 400 || status === 401) return false;
                throw new Error(`Refresh token request failed (${status}): ${body}`);
            }

            const json = await res.json();
            this.accessToken = json.access_token;
            this.refreshToken = json.refresh_token ?? this.refreshToken;
            this.setExpiryFromNow(json.expires_in ?? 300);
            return true;
        } catch {
            // Network or other failure → caller decides fallback
            return false;
        }
    }

    private async passwordGrant(): Promise<void> {
        if (!this.opts.admin_username || !this.opts.admin_password) {
            throw new Error('Refresh failed and no credentials provided to reauthenticate.');
        }
        const ctx = await request.newContext();
        try {
            const res = await ctx.post(this.tokenUrl(), {
                data: {
                    grant_type: 'password',
                    username: this.opts.admin_username,
                    password: this.opts.admin_password,
                    client_id: this.opts.client_id,
                    client_secret: this.opts.client_secret,
                    scope: this.opts.scope,
                },
                ignoreHTTPSErrors: true,
            });

            if (!res.ok()) {
                const body = await safeText(res);
                throw new Error(`Password grant failed (${res.status()}): ${body}`);
            }

            const json = await res.json();
            this.accessToken = json.access_token;
            this.refreshToken = json.refresh_token;
            this.setExpiryFromNow(json.expires_in ?? 300);
        } finally {
            await ctx.dispose();
        }
    }

    private tokenUrl(): string {
        const base = this.opts.app_url.replace(/\/+$/, '');
        const endpoint = (this.opts.token_endpoint ?? 'oauth/token').replace(/^\/?/, '/');
        return `${base}${endpoint}`;
    }
}

async function safeText(res: any): Promise<string> {
    try {
        return await res.text();
    } catch {
        return '';
    }
}

export type { AdminApiAuthOptions as AuthOptions };
