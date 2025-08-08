import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { satisfies } from 'compare-versions';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';

export class ManufacturerCreate implements PageObject {
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly nameInput: Locator;
    public readonly websiteInput: Locator;
    public readonly descriptionInput: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.nameInput = page.getByLabel('Name');
        this.websiteInput = page.getByLabel('Website');
        if (satisfies(instanceMeta.version, '<6.8')) {
            this.descriptionInput = page.locator('.sw-text-editor__content-editor');
        } else {
            this.descriptionInput = page.locator('.mt-text-editor__content-editor');
        }
    }

    url() {
        return `#/sw/manufacturer/create`
    }
}
