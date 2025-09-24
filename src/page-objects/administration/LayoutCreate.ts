import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class LayoutCreate implements PageObject {

  //layout types
  public readonly shopPageButton: Locator;
  public readonly landingPageButton: Locator;
  public readonly listingPageButton: Locator;
  public readonly productPageButton: Locator;

  public readonly cancelButton: Locator;
  public readonly saveButton: Locator;

  //section types
  public readonly fullWidthButton: Locator;
  public readonly sidebarButton: Locator;
  public readonly backButton: Locator;

  //label
  public readonly layoutNameInput: Locator;
  public readonly createLayoutButton: Locator;

  public readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    this.shopPageButton = page.getByRole('button', { name: 'Shop page' });
    this.landingPageButton = page.getByRole('button', { name: 'Landing page' });
    this.listingPageButton = page.getByRole('button', { name: 'Listing page' });
    this.productPageButton = page.getByRole('button', { name: 'Product page' });

    this.cancelButton = page.getByRole('link', { name: 'Cancel' });
    this.saveButton = page.getByRole('button', { name: 'Save' });

    this.fullWidthButton = page.getByRole('button', { name: 'Full width' });
    this.sidebarButton = page.getByRole('button', { name: 'Sidebar' });
    this.backButton = page.getByRole('button', { name: 'Back' }); 

    this.layoutNameInput = page.getByRole('textbox', { name: 'Layout name' });
    this.createLayoutButton = page.getByRole('button', { name: 'Create layout' });
  }

  url() {
    return `#/sw/cms/create`;
  }
}
