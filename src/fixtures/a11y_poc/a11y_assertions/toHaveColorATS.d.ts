//need this file if you want to import in '../src/services/Actor.ts' like this:
//import '../fixtures/a11y_poc/toHaveColorATS';

//can we combine all matchers in a single .d.ts file? Or do we need 1 .d.ts per new assertion?

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveColorATS(expected: string, options?: { timeout?: number }): Promise<R>;
    }
  }
}

//need this to make this file a module
export {};