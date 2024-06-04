import type { Page } from '@playwright/test';

export interface PageObject {
    readonly page: Page;
   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    goTo(...args: any): Promise<void>;
}