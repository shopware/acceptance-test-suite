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

    async presses(locator: Locator, key: string) {
        const stepTitle = `${this.name} presses ${key} on ${locator}`;
        await test.step(stepTitle, async () =>{
            await expect(locator).toBeVisible();
            await locator.focus();
            await expect(locator).toBeFocused();        
            await expect(locator).toBeEnabled();
            /*if I want retries (do we? I'm not sure I would)
            await expect(async () => {
                await expect(locator).toBeFocused();
            }).toPass();
            */
            await expect(locator).toHaveColour('rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 66, 160) 0px 0px 0px 4px'); 
            await expect(locator).toHaveVisibleFocus();
            await locator.press(key);
        });
    }

    async fillsIn(locator: Locator, input: string) {
        const stepTitle = `${this.name} fills ${locator} with text "${input}"`;
        await test.step(stepTitle, async () =>{
            //fill() auto-checks if visible/enabled/editable
            //So there are technically 7 assertions running in this function which I did merely for consistency's sake until we figure out how to break down actionability checks

            await expect(locator).toBeVisible();
            await locator.focus();
            await expect(locator).toBeFocused();
            await expect(locator).toBeEnabled();
            await expect(locator).toHaveVisibleFocus();
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
