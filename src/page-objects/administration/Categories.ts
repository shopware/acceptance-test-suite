import type { Locator, Page } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Categories implements PageObject {
  /**
   * Landing pages
   */
  public readonly landingPageArea: Locator;
  public readonly landingPageHeadline: Locator;
  public readonly addLandingPageButton: Locator;
  public readonly landingPageItems: Locator;

  /**
   * Category tree
   */
  public readonly categoryTree: Locator;
  public readonly homeCategory: Locator;
  public readonly homeCategoryContextButton: Locator;
  public readonly categoryMenuItemList: Locator;
  public readonly createCategoryInput: Locator;
  public readonly confirmCategoryCreationButton: Locator;
  public readonly categoryItems: Locator;

  /**
   * General
   */
  public readonly nameInput: Locator;
  public readonly activeCheckbox: Locator;
  public readonly categoryTypeSelectionList: Locator;
  public readonly filtersResultPopoverItemList: Locator;
  public readonly saveButton: Locator;

  /**
   * Customisable link
   */
  public readonly entitySelectionList: Locator;
  public readonly linkTypeSelectionList: Locator;
  public readonly categorySelectionList: Locator;
  public readonly productSelectionList: Locator;
  public readonly landingPageSelectionList: Locator;
  public readonly filterResultPopoverTreeCheckboxItemList: Locator;
  public readonly openInNewTabCheckbox: Locator;

  constructor(public readonly page: Page) {
    this.landingPageArea = page.locator('.sw-category-detail__landing-page-collapse');
    this.landingPageHeadline = this.landingPageArea.getByRole('heading', { name: 'Landing pages' });
    this.addLandingPageButton = this.landingPageArea.getByText('Add landing page');
    this.landingPageItems = this.landingPageArea.locator('.sw-tree-item__label');
    this.categoryTree = page.locator('.sw-category-tree');
    this.homeCategory = this.categoryTree.locator('.sw-tree-item__element').filter({ hasText: 'Home' });
    this.homeCategoryContextButton = this.homeCategory.locator('.sw-context-button__button');
    this.categoryMenuItemList = page.locator('.sw-context-button__menu-popover').locator('.sw-context-menu-item');
    this.createCategoryInput = page.getByPlaceholder('Create category').getByRole('textbox');
    this.confirmCategoryCreationButton = page.locator('.sw-confirm-field').locator('.sw-button--primary');
    this.categoryItems = this.categoryTree.locator('.sw-tree-item__label');
    this.nameInput = page.getByLabel('Name');
    this.activeCheckbox = page.getByRole('checkbox', { name: 'Active' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.categoryTypeSelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Category type' })
      .locator('.sw-select__selection');
    this.linkTypeSelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Link type' })
      .locator('.sw-select__selection');
    this.entitySelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Entity' })
      .locator('.sw-select__selection');
    this.categorySelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Category' })
      .locator('.sw-select__selection');
    this.productSelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Product' })
      .locator('.sw-select__selection');
    this.landingPageSelectionList = page
      .locator('.sw-select')
      .filter({ hasText: 'Landing page' })
      .locator('.sw-select__selection');
    this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    this.filterResultPopoverTreeCheckboxItemList = page.locator('.sw-tree__content').getByRole('checkbox');
    this.openInNewTabCheckbox = page.getByRole('checkbox', { name: 'Open in new tab' });
  }

  async getLandingPageByName(landingPageName: string) : Promise<Locator> {
    return this.landingPageItems.locator(`text="${landingPageName}"`);
  }

  url() {
    return `#/sw/category/index`;
  }
}
