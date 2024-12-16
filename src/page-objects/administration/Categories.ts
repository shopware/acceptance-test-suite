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
  public readonly categoryMenuItemList: Locator;
  public readonly createCategoryInput: Locator;
  public readonly confirmCategoryCreationButton: Locator;
  public readonly confirmCategoryCancelButton: Locator;
  public readonly categoryItems: Locator;

  /**
   * General
   */
  public readonly nameInput: Locator;
  public readonly activeCheckbox: Locator;
  public readonly categoryTypeSelectionList: Locator;
  public readonly filtersResultPopoverItemList: Locator;
  public readonly saveButton: Locator;
  public readonly loadingSpinner: Locator;
  public readonly fadingBar: Locator;

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
  public readonly popoverCategoryTree: Locator;

  constructor(public readonly page: Page) {
    this.landingPageArea = page.locator('.sw-category-detail__landing-page-collapse');
    this.landingPageHeadline = this.landingPageArea.getByRole('heading', { name: 'Landing pages' });
    this.addLandingPageButton = this.landingPageArea.getByText('Add landing page');
    this.landingPageItems = this.landingPageArea.locator('.sw-tree-item__label');
    this.categoryTree = page.locator('.sw-category-tree');

    this.categoryMenuItemList = page.locator('.sw-context-menu-item');
    this.createCategoryInput = page.getByPlaceholder('Create category').getByRole('textbox');
    this.confirmCategoryCreationButton = page.locator('.sw-confirm-field').locator('.sw-button--primary');
    this.categoryItems = this.categoryTree.locator('.tree-link');
    this.confirmCategoryCancelButton = page.locator('.sw-confirm-field').locator('.sw-confirm-field__button--cancel');
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
      .locator('.sw-category-link-settings__selection-category');
    this.productSelectionList = page
      .locator('.sw-category-link-settings__selection-product');
    this.landingPageSelectionList = page
      .locator('.sw-category-link-settings__selection-landing-page');
    this.filtersResultPopoverItemList = page.locator('.sw-select-result-list__content').getByRole('listitem');
    this.popoverCategoryTree = page.locator('.sw-category-tree-field__results_popover');
    this.filterResultPopoverTreeCheckboxItemList = this.popoverCategoryTree.locator('.sw-tree__content').locator('.sw-tree-item');
    this.openInNewTabCheckbox = page.getByRole('checkbox', { name: 'Open in new tab' });
    this.loadingSpinner = page.locator('.sw-loader');
    this.fadingBar = page.locator('.fade-leave-active');
  }

  async getLandingPageByName(landingPageName: string): Promise<Locator> {
    return this.landingPageItems.locator(`text="${landingPageName}"`);
  }

  async getPopOverCategoryByName(categoryName: string): Promise<Locator> {
    return this.popoverCategoryTree.locator('.sw-tree-item__element').filter({ hasText: `${categoryName}` });
  }

  getTreeItemContextButton(name: string): Locator {
    return this.categoryTree
      .locator('.sw-tree-item__element')
      .filter({ hasText: name })
      .locator('.sw-context-button__button');
  }

  url() {
    return '#/sw/category/index';
  }
}
