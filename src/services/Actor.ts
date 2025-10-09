import { test, expect } from '@playwright/test';
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
        
        const tagName = await locator.evaluate(el => el.tagName);

        /* Storefront buttons and links only use :focus-visible, which locator.focus() doesn't trigger by default. 
        *  Using a keyboard event tricks the browser into using :focus-visible the next time you call locator.focus().
        */
        if (tagName === 'BUTTON' || tagName === 'A'){
            await this.page.keyboard.press('Shift');
        }   

        await locator.focus();
        await expect(locator).toBeFocused();        
        await expect(locator).toHaveVisibleFocus(); 
    }

    async selectsRadioButton(radioGroup: Locator, inputLabel: string){

        const desiredOption = radioGroup.getByRole('radio', { name: inputLabel });

        if(!(await desiredOption.isChecked()))
        {
            const options: { label: string; locator: Locator; isChecked: boolean }[] = [];

            for (const labelEl of await radioGroup.locator('label').all()) {
                
                const label = await labelEl.innerText();
                const radioButton = radioGroup.getByRole('radio', { name: label });
                const isChecked = await radioButton.isChecked();

                options.push({ label, locator: radioButton, isChecked });
            } 

            const defaultOptionIndex = options.findIndex(opt => opt.isChecked);
            const desiredOptionIndex = options.findIndex(opt => opt.label === inputLabel);

            if(defaultOptionIndex < desiredOptionIndex)
            {        
                /* need waitForLoadState() because in most cases selecting a radio button
                 * either reloads the page or navigates to a new one (product variants)
                 */
                for(let i = defaultOptionIndex; i < desiredOptionIndex; i++){
                    await this.presses(options[i].locator, 'ArrowDown');
                    this.page.waitForLoadState('domcontentloaded'); 
                }
            }

            else{
                for(let i = defaultOptionIndex; i > desiredOptionIndex; i--){
                    await this.presses(options[i].locator, 'ArrowUp');
                    this.page.waitForLoadState('domcontentloaded');
                }
            }
        }
        
        await this.a11y_checks(desiredOption);
    }
    
    async presses(locator: Locator, key: string) {
        const stepTitle = `${this.name} presses ${key} on ${locator}`;
        await test.step(stepTitle, async () =>{ 
            await this.a11y_checks(locator);
            await locator.press(key);
        });
    }

    async fillsIn(locator: Locator, input: string) {
        const stepTitle = `${this.name} fills ${locator} with text "${input}"`;
        await test.step(stepTitle, async () =>{
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
