import { expect as baseExpect, Locator } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveColorATS(locator: Locator, expected: string, options?: { timeout?: number }) {
    const assertionName = 'toHaveColorATS';
    let pass: boolean;

    //this might be why mergeExpects doesn't work 
    //see Weird Error I experienced: https://playwrightsolutions.com/the-definitive-guide-to-api-test-automation-with-playwright-part-14-custom-assertions-extending-expect/
    let matcherResult: any; 
    
    try {
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toHaveCSS('color', String(expected), options);
      pass = true;
    } catch (e: any) {
      matcherResult = e.matcherResult;
      pass = false;
    }

    if (this.isNot) {
      pass =!pass;
    }

    const message = pass
      ? () => this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: not ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '')
      : () =>  this.utils.matcherHint(assertionName, undefined, undefined, { isNot: this.isNot }) +
          '\n\n' +
          `Locator: ${locator}\n` +
          `Expected: ${this.utils.printExpected(expected)}\n` +
          (matcherResult ? `Received: ${this.utils.printReceived(matcherResult.actual)}` : '');

    return {
      message,
      pass,
      name: assertionName,
      expected,
      actual: matcherResult?.actual,
    };
  },
});


/*don't need if overriding the expect for Actors with import { expect } from '../toHaveColorATS';
declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveColorATS(expected: string, options?: { timeout?: number }): Promise<R>;
    }
  }
}*/