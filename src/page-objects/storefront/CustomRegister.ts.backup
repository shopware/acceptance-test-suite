import type { Page } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { AccountLogin } from './AccountLogin';

export class CustomRegister extends AccountLogin implements PageObject {
    
    constructor(public readonly page: Page) {
        super(page);
    }

    url(customCustomerGroupName?: string) {
        return `${customCustomerGroupName?.replace(/\s+/g, '-') ?? ''}`;
    }
}