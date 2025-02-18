import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from 'src/fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class CustomerGroupCreate implements PageObject {
    public readonly headline: Locator;
    public readonly saveButton: Locator;
    public readonly cancelButton: Locator;
    public readonly cardTitle: Locator;
    public readonly customerGroupNameField: Locator;
    public readonly customerGroupGrossTaxDisplay: Locator;
    public readonly customerGroupNetTaxDisplay: Locator;
    public readonly customSignupFormToggle: Locator;
    public readonly signupFormTitle: Locator;
    public readonly signupFormIntroduction: Locator;
    public readonly signupFormSeoDescription: Locator;
    public readonly signupFormCompanySignupToggle: Locator;
    public readonly customerGroupSaleschannelSelection: Locator;
    public readonly customerGroupSaleschannelResultList: Locator;

    constructor(public readonly page: Page, public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.headline = page.getByRole('heading', { name: 'New customer group' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.cardTitle = page.getByRole('heading', { name: 'Customer group' });
        this.customerGroupNameField = page.locator('#sw-field--customerGroup-name');
        this.customerGroupGrossTaxDisplay = page.locator('#sw-field--castedValue-0');
        this.customerGroupNetTaxDisplay = page.locator('#sw-field--castedValue-1');
        this.customSignupFormToggle = page.getByLabel('Custom signup form');
        this.signupFormTitle = page.locator('#sw-field--customerGroup-registrationTitle');
        if (satisfies(instanceMeta.version, '<6.7')) {
            this.signupFormIntroduction = page.locator('.sw-text-editor__content-editor');
        } else {
            this.signupFormIntroduction = page.locator('.mt-text-editor__content-editor');
        }
        this.signupFormSeoDescription = page.locator('#sw-field--customerGroup-registrationSeoMetaDescription');
        this.signupFormCompanySignupToggle = page.getByLabel('Company signup form');
        this.customerGroupSaleschannelSelection = page.locator('input[class=sw-select-selection-list__input]');
        this.customerGroupSaleschannelResultList = page.locator('.sw-select-result-list__content');
    }

    url() {
        return '#/sw/settings/customer/group/create';
    }
}