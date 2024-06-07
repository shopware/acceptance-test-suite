import type { Page } from '@playwright/test';

export interface PageObject {
    readonly page: Page;

    goTo(params?: Record<string, unknown>): Promise<void>;
}
