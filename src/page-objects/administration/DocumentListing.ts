import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class DocumentListing implements PageObject {
    public readonly addDocumentButton: Locator;
    public readonly invoiceLink: Locator;

    constructor(public readonly page: Page) {
        this.addDocumentButton = page.getByRole('button', { name: 'Add document' });
        this.invoiceLink = page.getByRole('link', { name: 'invoice', exact: true });
    }

    url() {
        return `#/sw/settings/document/index`;
    }
}