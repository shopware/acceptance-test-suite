import { expect as baseExpect, Locator } from '@playwright/test';

// Extend Playwright's expect with custom matchers
export const expect = baseExpect.extend({
  async toHaveColour(locator: Locator, expected: string) {
    try {
      // Validate the expected color format (hex, rgb, rgba, etc.)
      const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$|^rgb\(\d{1,3},\s*\d{1,3},\s*\d{1,3}\)$|^rgba\(\d{1,3},\s*\d{1,3},\s*\d{1,3},\s*(0|1|0?\.\d+)\)$/;
      if (!colorRegex.test(expected)) {
        return {
          message: () => `expected color "${expected}" to be a valid hex, rgb, or rgba format`,
          pass: false,
        };
      }

      // Use toHaveCSS to check the 'color' property
      await expect(locator).toHaveCSS('color', expected);

      return {
        message: () => `expected ${locator} to have color ${expected}`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected ${locator} to have color ${expected}, but it failed with error: ${(error as Error).message}`,
        pass: false,
      };
    }
  },

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