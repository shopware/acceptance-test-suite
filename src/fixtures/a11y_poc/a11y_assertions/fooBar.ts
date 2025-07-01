import { expect } from '@playwright/test';

const customMatchers = {
    async toBeFoo() {
    return { pass: true, message: () => 'foo' };
  },

    async toBeBar() {
    return { pass: true, message: () => 'bar' };
  },

  async toBeGreen(received: string) {
    const expected = 'rgb(0, 128, 0)';
    const pass = received === expected;
    return {
      message: () =>
        pass
          ? `raven expected ${received} not to be green`
          : `raven expected ${received} to be green`,
      pass,
    };
  },

};

expect.extend(customMatchers);

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toBeFoo(): R;
      toBeBar(): R;
      toBeGreen(): R;
    }
  }
}