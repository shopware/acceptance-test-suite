import { expect as baseExpect } from '@playwright/test';
import type { Locator } from '@playwright/test';

export const expect = baseExpect.extend({
  async toHaveVisibleFocus(locator: Locator, options?: { timeout?: number }) {
    const assertionName = 'toHaveVisibleFocus';
    const expected = 'rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 66, 160) 0px 0px 0px 4px';

    //to test if working (will fail)
    //const expected = 'rgb(0, 0, 0) 0px 0px 0px 2px, rgb(0, 66, 160) 0px 0px 0px 4px';

    let pass: boolean;
    let matcherResult: any;
    try {
      const expectation = this.isNot ? baseExpect(locator).not : baseExpect(locator);
      await expectation.toHaveCSS('box-shadow', expected, options);
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