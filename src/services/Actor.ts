import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import type { PageObject } from '../types/PageObject';

export class Actor {
    public page: Page;
    public readonly name: string;

    constructor(name: string, page: Page) {
        this.name = name;
        this.page = page;
    }

    expects = expect;

    async attemptsTo(task: () => Promise<void>) {
        const stepTitle = `${this.name} attempts to ${this.camelCaseToLowerCase(task.name)}`;
        await test.step(stepTitle, async () => await task());
    }

    async goesTo(pageObject: PageObject) {
        const stepTitle = `${this.name} navigates to ${this.camelCaseToLowerCase(pageObject.constructor.name)}`;

        await test.step(stepTitle, async () => {
            await pageObject.goTo();

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
        });
    }

    private camelCaseToLowerCase(str: string) {
        return str.replace(/[A-Z]/g, letter => ` ${letter.toLowerCase()}`);
    }
}
