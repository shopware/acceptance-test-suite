import { test, expect } from '@playwright/test';
import type { Page } from 'playwright-core';

export class Actor {
    public page: Page;
    public readonly name: string;
    public baseURL: string | undefined;

    constructor(name: string, page: Page, baseURL?: string) {
        this.name = name;
        this.page = page;
        this.baseURL = baseURL;
    }

    expects = expect;

    async attemptsTo(task: () => Promise<void>) {
        const stepTitle = `${this.name} attempts to ${this.camelCaseToLowerCase(task.name)}`;
        await test.step(stepTitle, async () => await task());
    }

    async goesTo(url: string, forceReload = false) {
        const stepTitle = `${this.name} navigates to "${url}"`;


        await test.step(stepTitle, async () => {
            if (this.baseURL && !forceReload && url.startsWith('#')) {
                const baseURLWithoutSlash = this.baseURL.charAt(this.baseURL.length - 1) == '/' ?
                    this.baseURL.substr(0, this.baseURL.length - 1) : this.baseURL;
                const fullURL = new URL(url, baseURLWithoutSlash);

                await this.page.evaluate(`document.location = "${url}";`);

                await this.page.waitForURL(`${fullURL.toString()}**`, { timeout: 15_000 });

                await expect(this.page.locator('.sw-skeleton')).toHaveCount(0);
            } else {
                await this.page.goto(url);

                await this.page.addStyleTag({
                    content: `
                    .sf-toolbar {
                        width: 0 !important;
                        height: 0 !important;
                        display: none !important;
                        pointer-events: none !important;
                    }
                    `.trim(),
                });
            }
        });
    }

    private camelCaseToLowerCase(str: string) {
        return str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
    }
}
