import { test, expect } from '@playwright/test';
import type { Page, Locator } from 'playwright-core';

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
        await expect(locator).toHaveVisibleFocus(); 
    }

    async fillsIn(locator: Locator, input: string) {
        const stepTitle = `${this.name} fills ${locator} with text "${input}"`;
        await test.step(stepTitle, async () =>{
            await this.a11y_checks(locator);
            await locator.fill(input);
        });
    }

    async presses(locator: Locator, key?: string) {

        let defaultKey: string = 'Space';
        const tagName = await locator.evaluate(el => el.tagName);

        /** 
         * Storefront buttons and links only use :focus-visible, which locator.focus() doesn't trigger by default. 
         *     Using a keyboard event triggers :focus-visible the next time you call locator.focus().
         */
        if (tagName === 'BUTTON' || tagName === 'A'){
            await this.page.keyboard.press('Shift');

            /** 
             * Be aware that a native <button> fires on key down with 'Enter' but on key up with 'Space'.
             *     Source: https://adrianroselli.com/2022/04/brief-note-on-buttons-enter-and-space.html     
             */ 
            defaultKey = 'Enter';
        } 

        const inputKey = key ?? defaultKey;

        const stepTitle = `${this.name} presses ${inputKey} on ${locator}`;
        await test.step(stepTitle, async () =>{ 
            await this.a11y_checks(locator);            
            await locator.press(inputKey);
        });
    }

    async selectsRadioButton(radioGroup: Locator, inputLabel: string) {
        const stepTitle = `${this.name} selects radio button ${inputLabel}`;
      
        await test.step(stepTitle, async () => {
          const desiredOption = radioGroup.getByRole('radio', { name: inputLabel });
      
          if (await desiredOption.isChecked()) {
            await this.a11y_checks(desiredOption);
            return;
          }
      
          const checkedRadio = radioGroup.getByRole('radio', { checked: true });
      
          if (!(await checkedRadio.count())) {
            throw new Error('No radio button is selected by default.');
          }
      
          await checkedRadio.first().focus();
      
          const maxIterations = await radioGroup.getByRole('radio').count();
          let iterations = 0;
      
          while (!(await desiredOption.isChecked())) {
            if (iterations >= maxIterations) {
              throw new Error(
                `Could not reach radio button "${inputLabel}" via keyboard navigation.`
              );
            }
      
            await this.page.keyboard.press('ArrowDown');
            await this.page.waitForLoadState('domcontentloaded');
      
            iterations++;
          }
      
          await this.a11y_checks(desiredOption);
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
