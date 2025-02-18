import type { Page, Locator } from '@playwright/test';
import type { PageObject } from '../../types/PageObject';
import { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class AccountAddresses implements PageObject {
    public readonly addNewAddressButton: Locator;
    public readonly editBillingAddressButton: Locator;
    public readonly editShippingAddressButton: Locator;
    public readonly useDefaultBillingAddressButton: Locator;
    public readonly useDefaultShippingAddressButton: Locator;
    public readonly deliveryNotPossibleAlert: Locator | undefined;
    public readonly availableAddresses: Locator | undefined;
    public readonly addressDropdownButton: Locator | undefined
    public readonly availableAddressesUseAsBillingAddress: Locator | undefined;
    public readonly availableAddressesUseAsShippingAddress: Locator | undefined;

    constructor(public readonly page: Page,
                public readonly instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.addNewAddressButton = page.getByRole('link', { name: /Add (new )?address/ });
        this.editBillingAddressButton = page.getByRole('link', { name: 'Edit address' }).first();
        this.editShippingAddressButton = page.getByRole('link', { name: 'Edit address' }).nth(1);
        this.useDefaultBillingAddressButton = page.getByRole('button', { name: 'Use as default billing address' });
        this.useDefaultShippingAddressButton = page.getByRole('button', { name: 'Use as default shipping address' });

        if (satisfies(instanceMeta.version, '<6.7')){
            this.availableAddresses = page.locator('.other-address').locator('.address').nth(1);
            this.deliveryNotPossibleAlert = this.availableAddresses.getByText('A delivery to this country is not possible.');
        }
        else {
            this.availableAddresses = page.locator('.address-manager-list-wrapper');
            this.addressDropdownButton = this.availableAddresses.locator('#dropdownMenuButton');
            this.availableAddressesUseAsBillingAddress = this.availableAddresses.getByRole('button', { name: 'Use as default billing address' });
            this.availableAddressesUseAsShippingAddress = this.availableAddresses.getByRole('button', { name: 'Use as default shipping address' });
        }
    }

    url() {
        return 'account/address';
    }
}