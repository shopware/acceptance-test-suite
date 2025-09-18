import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class ListingPageLayoutDetail implements PageObject {

  //General
  public readonly addSectionButton: Locator;
  public readonly sectionSelectionField: Locator;
  public readonly fullWidthSection: Locator;
  public readonly sidebarSection: Locator;
  public readonly sectionEmptyState: Locator;
  public readonly saveButton: Locator;
  public readonly loadingSpinner: Locator;
  public readonly loaderButton: Locator;

  //Blocks
  public readonly productListingBlock: Locator;
  public readonly sidebarTitle: Locator;

  //Sidebar
  public readonly settingsButton: Locator;
  public readonly blocksButton: Locator;
  public readonly navigatorButton: Locator;
  public readonly layoutAssignmentButton: Locator;
  
  public readonly page: Page;

  constructor(page: Page) {
    //General
    this.page = page;
    this.addSectionButton = page.locator('.sw-cms-stage-add-section__button');
    this.sectionSelectionField = page.locator('.sw-cms-stage-section-selection');
    this.fullWidthSection = page.locator('.sw-cms-stage-section-selection__default');
    this.sidebarSection = page.locator('.sw-cms-stage-section-selection__sidebar');
    this.sectionEmptyState = page.locator('.sw-cms-section__empty-stage');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.loadingSpinner = page.locator('.sw-loader');
    this.loaderButton = page.locator('.mt-button__loader');

    //Blocks
    this.productListingBlock = page.locator('.sw-cms-block-product-listing');
    this.sidebarTitle = page.locator('.sw-sidebar-item__title');

    //Sidebar
    this.settingsButton = page.locator('button[title="Settings"]');
    this.blocksButton = page.locator('button[title="Blocks"]');
    this.navigatorButton = page.locator('button[title="Navigator"]');
    this.layoutAssignmentButton = page.locator('button[title="Layout assignment"]');
  }

  url(layoutId: string) {
    return `#/sw/cms/detail/${layoutId}`;
  }
}
