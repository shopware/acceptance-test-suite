import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class DocumentListing implements PageObject {
    public readonly addDocumentButton: Locator;
    public readonly invoiceLink: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.addDocumentButton = page.getByRole('button', { name: 'Add document' });
        this.invoiceLink = page.getByRole('link', { name: 'invoice', exact: true });
    }

    url() {
        return `#/sw/settings/document/index`;
    }
}