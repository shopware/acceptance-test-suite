import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';

export class Footer implements PageObject {
    public readonly footerHeadline: Locator;
    public readonly footerContent: Locator;
    public readonly footerHotline: Locator;
    public readonly footerContactForm: Locator;
    public readonly footerContactFormLink: Locator;

    constructor(public readonly page: Page) {
        this.footerHeadline = page.locator('.footer-column-headline');
        this.footerContent = page.locator('.footer-column-content-inner');
        this.footerHotline = page.locator('.footer-contact-hotline');
        this.footerContactForm = page.locator('.footer-contact-form');
        this.footerContactFormLink = page.getByRole('link', { name: 'contact form' });
    }
    
    url() {
        // Footer is part of other pages and does not have a url, but the class needs a url method.
        throw new Error('Footer does not have an own url.');
        return '';
    }
}