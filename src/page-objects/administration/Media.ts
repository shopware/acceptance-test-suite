import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

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
        this.uploadFileButton = page.getByRole('button', { name: translate('administration:media:buttons.uploadFile') });
        this.addNewFolderButton = page.getByRole('button', { name: translate('administration:media:buttons.addNewFolder') });
        this.searchInput = page.getByPlaceholder(translate('administration:media:search.placeholder'));

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
     * Gets the title/name of a media item by its image alt text
     * @param alt The alt text of the image
     * @returns Promise that resolves to the title text
     */
    async getMediaNameByAlt(alt: string): Promise<string> {
        const mediaItem = this.mediaGridItems.filter({ has: this.page.locator(`img[alt="${alt}"]`) });
        const titleElement = mediaItem.locator('.sw-media-base-item__name');
        return (await titleElement.textContent()) || '';
    }

    /**
     * Gets a specific media item container by its name/title
     * @param mediaName The name/title of the media item
     * @returns Locator for the specific media item container
     */
    getMediaItemByName(mediaName: string): Locator {
        return this.mediaGridItems.filter({ hasText: mediaName });
    }

    /**
     * Gets the context menu button for a specific media item by media name
     * @param mediaName The name/title of the media item
     * @returns Locator for the context menu button
     */
    getContextMenuButtonByName(mediaName: string): Locator {
        return this.getMediaItemByName(mediaName).locator('.sw-context-button');
    }

    /**
     * Gets a specific context menu item by its text
     * @param itemText The text of the context menu item (e.g., 'Rename', 'Delete', etc.)
     * @returns Locator for the specific context menu item
     */
    getContextMenuItem(itemText: string): Locator {
        return this.page.locator('.sw-context-menu-item', {
            hasText: itemText,
        });
    }
}
