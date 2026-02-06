import type { Page } from "playwright-core";

export interface PageObject {
    readonly page: Page;

    url(...args: unknown[]): string;
}
