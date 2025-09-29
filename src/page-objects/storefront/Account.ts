import type { Page, Locator } from 'playwright-core';
import type { PageObject } from '../../types/PageObject';
import { translate } from '../../services/LanguageHelper';
import type { HelperFixtureTypes } from '../../fixtures/HelperFixtures';
import { satisfies } from 'compare-versions';

export class Account implements PageObject {
    public readonly headline: Locator;
    public readonly personalDataCardTitle: Locator;
    public readonly paymentMethodCardTitle: Locator;
    public readonly billingAddressCardTitle: Locator;
    public readonly shippingAddressCardTitle: Locator;
    public readonly newsletterCheckbox: Locator;
    public readonly newsletterRegistrationSuccessMessage: Locator;
    public readonly customerGroupRequestMessage: Locator;
    public readonly cannotDeliverToCountryAlert: Locator;
    public readonly shippingToAddressNotPossibleAlert: Locator;
    public readonly page: Page;
    public readonly instanceMeta: HelperFixtureTypes['InstanceMeta'];

    constructor(page: Page, instanceMeta: HelperFixtureTypes['InstanceMeta']) {
        this.page = page;
        this.instanceMeta = instanceMeta;
        this.headline = page.getByRole('heading', { name: translate('storefront:account:general.overview') });
        this.personalDataCardTitle = page.getByRole('heading', { name: translate('storefront:account:general.personalData') });
        this.paymentMethodCardTitle = page.getByRole('heading', { name: translate('storefront:account:general.defaultPaymentMethod') });
        this.billingAddressCardTitle = page.getByRole('heading', { name: translate('storefront:account:general.defaultBillingAddress') });
        this.shippingAddressCardTitle = page.getByRole('heading', { name: translate('storefront:account:general.defaultShippingAddress') });
        this.newsletterCheckbox = page.getByLabel(translate('storefront:account:general.newsletter'));
        this.newsletterRegistrationSuccessMessage = page.getByText(translate('storefront:account:general.newsletterRegistrationSuccess'));

        if (satisfies(instanceMeta.version, '<6.7')) {
            this.customerGroupRequestMessage = page.locator('.alert-content');
        } else {
            this.customerGroupRequestMessage = page.locator('.alert-content-container');
        }
        this.cannotDeliverToCountryAlert = page.getByText(translate('storefront:account:general.cannotDeliverToCountry'));
        this.shippingToAddressNotPossibleAlert = page.getByText(translate('storefront:account:general.shippingNotPossible'));
    }

    async getCustomerGroupAlert(customerGroup: string): Promise<Locator> {
        return this.customerGroupRequestMessage.getByText(`Access to customer group "${customerGroup}" requested.`);
    }

    url() {
        return 'account';
    }
}
