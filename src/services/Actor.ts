/* eslint-disable playwright/no-conditional-in-test */
import { test , expect} from '@playwright/test';
import type { Page, Locator } from '@playwright/test';


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

    async a11y_checks(locator: Locator){
        await locator.focus();
        await expect(locator).toBeFocused();        

        //toHaveVisibleFocus() will not currently work everywhere out of the box as buttons/links use:focus-visible and must be tabbed to
        //see: src/tasks/shop-customer/a11y_poc/customAssertions/ProceedFromProductToCheckout_a11yAssert.ts
        await expect(locator).toHaveVisibleFocus(); 
    }
    
    async presses(locator: Locator, key: string) {
        const stepTitle = `${this.name} presses ${key} on ${locator}`;
        await test.step(stepTitle, async () =>{
            
            //actionability checks - are they even necessary as focus() cannot work on nonvisible/non-enabled elements
            await expect(locator).toBeVisible();      
            await expect(locator).toBeEnabled();
            
            await this.a11y_checks(locator);
            await locator.press(key);
        });
    }

    async fillsIn(locator: Locator, input: string) {
        const stepTitle = `${this.name} fills ${locator} with text "${input}"`;
        await test.step(stepTitle, async () =>{
            //fill() auto-checks if visible/enabled/editable
            await this.a11y_checks(locator);
            await locator.fill(input);
        });
    }

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
