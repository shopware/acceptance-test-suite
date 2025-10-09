import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';

export class DocumentListing implements PageObject {
    public readonly addDocumentButton: Locator;
    public readonly invoiceLink: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.addDocumentButton = page.getByRole('button', { name: translate('administration:document:listing.addDocument') });
        this.invoiceLink = page.getByRole('link', { name: translate('administration:document:types.invoice'), exact: true });
    }

    url() {
        return `#/sw/settings/document/index`;
    }
}
