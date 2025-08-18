import type { Page } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { AccountLogin } from './AccountLogin';

export class CustomRegister extends AccountLogin implements PageObject {
    
    public readonly page: Page;

    constructor(page: Page) {
        super(page);
        this.page = page;
    }

    url(customCustomerGroupName?: string) {
        return `${customCustomerGroupName?.replace(/\s+/g, '-') ?? ''}`;
    }
}