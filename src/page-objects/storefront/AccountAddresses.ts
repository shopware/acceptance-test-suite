import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class AccountAddresses implements PageObject {
    public readonly addNewAddressButton: Locator;
    public readonly editBillingAddressButton: Locator;
    public readonly editShippingAddressButton: Locator;
    public readonly useDefaultBillingAddressButton: Locator;
    public readonly useDefaultShippingAddressButton: Locator;
    public readonly deliveryNotPossibleAlert: Locator | undefined;
    public readonly availableAddresses: Locator | undefined;
    public readonly addressDropdownButton: Locator | undefined;
    public readonly addressDropdownButtons: Locator | undefined;
    public readonly availableAddressesUseAsBillingAddress: Locator | undefined;
    public readonly availableAddressesUseAsShippingAddress: Locator | undefined;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.addNewAddressButton = page.getByRole('link', { name: /Add (new )?address/ });
        this.editBillingAddressButton = page.getByRole('link', { name: translate('storefront:address:actions.editAddress') }).first();
        this.editShippingAddressButton = page.getByRole('link', { name: translate('storefront:address:actions.editAddress') }).nth(1);
        this.useDefaultBillingAddressButton = page.getByRole('button', { name: translate('storefront:address:actions.useAsDefaultBilling') });
        this.useDefaultShippingAddressButton = page.getByRole('button', { name: translate('storefront:address:actions.useAsDefaultShipping') });

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.availableAddresses = page.locator('.other-address').locator('.address').nth(1);
            this.deliveryNotPossibleAlert = this.availableAddresses.getByText(translate('storefront:address:messages.deliveryNotPossible'));
        } else {
            this.availableAddresses = page.locator('.address-manager-list-wrapper');
            this.addressDropdownButton = this.availableAddresses.getByRole('button', { name: translate('storefront:address:actions.addressOptions') }).first();
            this.addressDropdownButtons = this.availableAddresses.getByRole('button', { name: translate('storefront:address:actions.addressOptions') });
            this.availableAddressesUseAsBillingAddress = this.availableAddresses.getByRole('button', { name: translate('storefront:address:actions.useAsDefaultBilling') });
            this.availableAddressesUseAsShippingAddress = this.availableAddresses.getByRole('button', { name: translate('storefront:address:actions.useAsDefaultShipping') });
        }
    }

    url() {
        return 'account/address';
    }
}
