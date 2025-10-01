import type { Page, Locator } from 'playwright-core';

export class AccountNavigation {
  public readonly overviewLink: Locator;
  public readonly yourProfileLink: Locator;
  public readonly addressesLink: Locator;
  public readonly ordersLink: Locator;
  public readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.overviewLink = page.getByRole('link', { name: 'Overview' });
    this.yourProfileLink = page.getByRole('link', { name: 'Your profile' });
    this.addressesLink = page.getByRole('link', { name: 'Addresses' });
    this.ordersLink = page.getByRole('link', { name: 'Orders' });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
  }
}