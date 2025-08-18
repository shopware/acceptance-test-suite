import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class PageNotFound implements PageObject {
    public readonly pageNotFoundImage: Locator;
    public readonly headline: Locator;
    public readonly pageNotFoundMessage: Locator;
    public readonly backToShopButton: Locator;

    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.pageNotFoundImage = page.getByAltText('Page not found');
        this.headline = page.getByRole('heading', { name: 'Page not found' });
        this.pageNotFoundMessage = page.getByText(`We are sorry, the page you're looking for could not be found. It may no longer exist or may have been moved.`);
        this.backToShopButton = page.getByRole('link', { name: 'Back to shop' });
    }

    url() {
        return 'non-existing-page';
    }
}
