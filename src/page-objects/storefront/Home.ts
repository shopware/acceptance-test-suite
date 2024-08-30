import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Home implements PageObject {

    public readonly productImages: Locator;
    public readonly productListItems: Locator;

    constructor(public readonly page: Page) {
        this.productImages = page.locator('.product-image-link');
        this.productListItems = page.getByRole('listitem');
    }

    url() {
        return './';
    }
}
