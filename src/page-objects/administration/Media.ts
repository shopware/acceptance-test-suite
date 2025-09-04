import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class Media implements PageObject {

  public readonly page: Page;
  public readonly uploadFileButton: Locator;
  public readonly addNewFolderButton: Locator;
  public readonly mediaGridItems: Locator;
  public readonly mediaItemCheckbox: Locator;
  public readonly mediaItemPreview: Locator;
  public readonly mediaItemName: Locator;
  public readonly mediaItemContextMenu: Locator;
  public readonly searchInput: Locator;


  constructor(page: Page) {
    this.page = page;
    this.uploadFileButton = page.getByRole('button', { name: 'Upload file' });
    this.addNewFolderButton = page.getByRole('button', { name: 'Add new folder' });
    this.searchInput = page.getByPlaceholder('Search current folder...');

    // Media grid items and their interactive elements
    this.mediaGridItems = page.locator('.sw-media-media-item');
    this.mediaItemCheckbox = page.locator('.sw-media-base-item__selected-indicator input[type="checkbox"]');
    this.mediaItemPreview = page.locator('.sw-media-preview-v2__item');
    this.mediaItemName = page.locator('.sw-media-base-item__name');
    this.mediaItemContextMenu = page.locator('.sw-context-button');
  }

  url() {
    return `#/sw/media/index`;
  }
  
  /**
   * Gets a specific media item by its name
   * @param name The filename to look for
   * @returns Locator for the specific media item
   */
  getMediaItemByName(name: string): Locator {
    return this.page.locator(`.sw-media-base-item__name`, { hasText: name }).first();
  }

  /**
   * Gets the image element by its alt text
   * @param alt The alt text of the image
   * @returns Locator for the specific image element
   */
  getImageLocatorByAlt(alt: string): Locator {
    return this.mediaGridItems.locator(`img[alt="${alt}"]`).first();
  }

  /**
   * Gets the context menu button for a specific media item
   * @param name The filename to look for
   * @returns Locator for the context menu button
   */
  getContextMenuForMediaItem(name: string): Locator {
    return this.mediaGridItems.filter({ hasText: name }).locator('.sw-context-button');
  }
  
  /**
   * Gets a specific context menu item by its text
   * @param itemText The text of the context menu item (e.g., 'Rename', 'Delete', etc.)
   * @returns Locator for the specific context menu item
   */
  getContextMenuItem(itemText: string): Locator {
    return this.page.locator('.sw-context-menu-item', {
      hasText: itemText
    });
  }
}
