import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class MediaListing implements PageObject {

    public readonly page: Page;
    public readonly scrollableElementVertical: Locator;
    public readonly mediaFolder: (title: string) => Locator;
    public readonly emptyState: Locator;
    public readonly updatedAtDate: Locator;

    constructor(page: Page) {
        this.page = page;
        this.scrollableElementVertical = page.locator('.sw-media-library__scroll-container');
        this.mediaFolder = (title: string) => page.locator('.sw-media-folder-item', { hasText: title });
        this.emptyState = page.locator('.sw-media-library__empty-state');
        this.updatedAtDate = page.locator('.sw-media-quickinfo-metadata-createdAt.sw-media-quickinfo-metadata-item__description');
    }
    url() {
        return '#/sw/media/index';
    }
}