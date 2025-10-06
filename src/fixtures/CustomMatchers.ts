import { expect as baseExpect, Locator } from '@playwright/test';

// Extend Playwright's expect with custom matchers
export const expect = baseExpect.extend({
  async toHaveVisibleFocus(locator: Locator) {
    try {
      // Check for common focus indicators using box-shadow, border or outline
      const boxShadowStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.boxShadow !== 'none';
      });

      const borderStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.borderStyle !== 'none' && computedStyle.borderWidth !== '0px';
      });

      const outlineStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.outline !== 'none' && computedStyle.outlineWidth !== '0px';
      });

      if (!boxShadowStyle && !borderStyle && !outlineStyle) {
        return {
          message: () => `expected ${locator} to have visible focus, but no outline, border or box-shadow was detected`,
          pass: false,
        };
      }

      return {
        message: () => `expected ${locator} to have visible focus`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${locator} to have visible focus, but it failed with error: ${(error as Error).message}`,
        pass: false,
      };
    }
  },
});

// Extend Playwright's Expect interface for TypeScript support
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveColour(expected: string): Promise<R>;
      toHaveVisibleFocus(): Promise<R>;
    }
  }
}