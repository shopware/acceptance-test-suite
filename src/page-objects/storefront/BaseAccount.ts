import type { Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { AccountNavigation } from './components/AccountNavigation';

export abstract class BaseAccount implements PageObject {
  readonly page: Page;
  readonly navigation: AccountNavigation;

  protected constructor(page: Page) {
    this.page = page;
    this.navigation = new AccountNavigation(page);
  }

  abstract url(): string;
}
