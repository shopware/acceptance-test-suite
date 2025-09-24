import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class LayoutListing implements PageObject {

    public readonly createNewLayoutButton: Locator;
    public readonly viewChangeButton: Locator;
    public readonly listingGrid: Locator;
    public readonly page: Page;
    public readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createNewLayoutButton = page.getByRole('button', { name: 'Create new layout' });
    this.viewChangeButton = page.locator('.sw-cms-list__actions-mode');
    this.listingGrid = page.locator('.sw-cms-list__list-grid');
    this.pagination = page.locator('.sw-pagination__list');
  }

  url() {
    return `#/sw/cms/index`;
  }
}
