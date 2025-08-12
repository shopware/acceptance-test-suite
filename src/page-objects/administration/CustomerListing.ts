import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';

export class CustomerListing implements PageObject {
    public readonly headline: Locator;
    public readonly addCustomerButton: Locator;
    public readonly bulkEditButton: Locator;
    public readonly deleteButton: Locator

    //Customer Bulk Edit Modal
    public readonly bulkEditModal: Locator;
    public readonly startBulkEditButton: Locator;
    public readonly cancelButton: Locator;
    public readonly modalHeaderCheckbox: Locator;
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.headline = page.getByRole('heading', { name: 'Customers' });
        this.addCustomerButton = page.locator('.sw-customer-list__button-create');
        this.bulkEditButton = page.getByRole('button', { name: 'Bulk edit' });
        this.deleteButton = page.getByRole('button', { name: 'Delete' });

        //Customer Bulk Edit Modal
        this.bulkEditModal = page.locator('.sw-customer-bulk-edit-modal').getByRole('dialog');
        this.startBulkEditButton = this.bulkEditModal.getByRole('button', { name: 'Start bulk edit' });
        this.cancelButton = this.bulkEditModal.getByRole('button', { name: 'Cancel' });
        const tableHeader = this.bulkEditModal.locator('.sw-data-grid__header');
        this.modalHeaderCheckbox = tableHeader.getByRole('checkbox');
    }

    async getCustomerByEmail(customerEmail: string): Promise<Record<string, Locator>> {

        const customer = this.page.getByRole('row').filter({ hasText: customerEmail });
        const customerName = customer.locator('.sw-data-grid__cell--firstName a');
        const customerStreet = customer.locator('.sw-data-grid__cell--defaultBillingAddress-street');
        const customerPostalCode = customer.locator('.sw-data-grid__cell--defaultBillingAddress-zipcode');
        const customerCity = customer.locator('.sw-data-grid__cell--defaultBillingAddress-city');
        const customerNumber = customer.locator('.sw-data-grid__cell--customerNumber')
        const customerGroup = customer.locator('.sw-data-grid__cell--group');
        const customerEmailAddress = customer.locator('.sw-data-grid__cell--email');
        const customerCheckbox = customer.getByRole('checkbox');

        return {
            customerName: customerName,
            customerStreet: customerStreet,
            customerPostalCode: customerPostalCode,
            customerCity: customerCity,
            customerNumber: customerNumber,
            customerGroup: customerGroup,
            customerEmailAddress: customerEmailAddress,
            customerCheckbox: customerCheckbox,
        }
    }

    async getCustomerBulkEditModalTitle(customerCount: number): Promise<Locator> {
        return this.bulkEditModal.getByRole('heading', { name: `Bulk edit - ${customerCount} items selected` });
    }

    async getBulkEditModalLineItemByCustomerEmail(customerEmail: string): Promise<Record<string, Locator>> {
        const lineItem = this.bulkEditModal.locator('.sw-data-grid__row').filter({ hasText: customerEmail });
        const customerCheckbox = lineItem.getByRole('checkbox');
        const customerName = lineItem.locator('.sw-data-grid__cell--firstName').getByRole('link');
        const customerStreet = lineItem.locator('.sw-data-grid__cell--defaultBillingAddress-street');
        const customerPostalCode = lineItem.locator('.sw-data-grid__cell--defaultBillingAddress-zipcode');
        const customerCity = lineItem.locator('.sw-data-grid__cell--defaultBillingAddress-city');
        const customerNumber = lineItem.locator('.sw-data-grid__cell--customerNumber')
        const customerGroup = lineItem.locator('.sw-data-grid__cell--group');
        const customerEmailAddress = lineItem.locator('.sw-data-grid__cell--email');

        return {
            customerCheckbox: customerCheckbox,
            customerName: customerName,
            customerStreet: customerStreet,
            customerPostalCode: customerPostalCode,
            customerCity: customerCity,
            customerNumber: customerNumber,
            customerGroup: customerGroup,
            customerEmailAddress: customerEmailAddress,
        }
    }

    url() {
        return '#/sw/customer/index';
    }
}