import { expect as baseExpect } from '@playwright/test';
import type { Locator } from 'playwright-core';

// Extend Playwright's expect with custom matchers
export const expect = baseExpect.extend({
  async toHaveVisibleFocus(locator: Locator) {
    try {
      /* Check for common focus indicators using box-shadow, border or outline
       *    Source: https://www.thegreenreport.blog/articles/testing-focus-order-and-visibility-for-wcag-compliance/testing-focus-order-and-visibility-for-wcag-compliance.html    
      */
      const boxShadowStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.boxShadow !== 'none';
      });

      const borderStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.borderStyle !== 'none' && 
          computedStyle.borderWidth !== '0px' && 
          computedStyle.borderColor !== 'transparent' &&
          !computedStyle.borderColor.includes('rgba(0, 0, 0, 0)');
      });

      const outlineStyle = await locator.evaluate((element) => {
        const computedStyle = window.getComputedStyle(element);
        return computedStyle.outline !== 'none' && 
          computedStyle.outlineWidth !== '0px' &&
          computedStyle.borderColor !== 'transparent' &&
          !computedStyle.borderColor.includes('rgba(0, 0, 0, 0)');
      });

      if (!boxShadowStyle && !borderStyle && !outlineStyle) {
        return {
          message: () => `expected ${locator} to have visible focus, but no outline, border or box-shadow was detected`,
          pass: false,
        };
      }

      return {
        message: () => `${locator} has visible focus`,
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
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveVisibleFocus(): Promise<R>;
    }
  }
}