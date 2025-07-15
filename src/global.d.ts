import { Expect } from '@playwright/test';

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toHaveColour(expected: string): Promise<R>;
      toHaveVisibleFocus(): Promise<R>;
    }
  }
}