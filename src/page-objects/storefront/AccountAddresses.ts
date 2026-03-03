import type { Page, Locator } from "playwright-core";
import { translate } from "../../services/LanguageHelper";
import type { HelperFixtureTypes } from "../../fixtures/HelperFixtures";
import { satisfies } from "compare-versions";
import { BaseAccount } from "./BaseAccount";
import { Address } from "../../types/ShopwareTypes";

export class AccountAddresses extends BaseAccount {
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
    public readonly instanceMeta: HelperFixtureTypes["InstanceMeta"];

    constructor(page: Page, instanceMeta: HelperFixtureTypes["InstanceMeta"]) {
        super(page);
        this.instanceMeta = instanceMeta;
        this.addNewAddressButton = page.getByRole("link", { name: translate("storefront:account:addresses.addNewAddress") });
        this.editBillingAddressButton = page.getByRole("link", { name: translate("storefront:address:actions.editAddress") }).first();
        this.editShippingAddressButton = page.getByRole("link", { name: translate("storefront:address:actions.editAddress") }).nth(1);
        this.useDefaultBillingAddressButton = page.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultBilling") });
        this.useDefaultShippingAddressButton = page.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultShipping") });

        if (satisfies(instanceMeta.version, "<6.7")) {
            this.availableAddresses = page.locator(".other-address").locator(".address").nth(1);
            this.deliveryNotPossibleAlert = this.availableAddresses.getByText(translate("storefront:address:messages.deliveryNotPossible"));
        } else {
            this.availableAddresses = page.locator(".address-manager-list-wrapper");
            this.addressDropdownButton = this.availableAddresses.getByRole("button", { name: translate("storefront:address:actions.addressOptions") }).first();
            this.addressDropdownButtons = this.availableAddresses.getByRole("button", { name: translate("storefront:address:actions.addressOptions") });
            this.availableAddressesUseAsBillingAddress = this.availableAddresses.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultBilling") });
            this.availableAddressesUseAsShippingAddress = this.availableAddresses.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultShipping") });
        }
    }

    url() {
        return "account/address";
    }

    private buildAddressRegex(data: Partial<Address>): RegExp {
        const parts = [data.firstName, data.lastName, data.street, data.zipcode, data.city].filter(Boolean);

        const pattern = parts.map((p) => this.escapeRegex(p!)).join(".*");
        return new RegExp(pattern);
    }

    private escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    async getAvailableAddress(partialAddressData: Partial<Address>): Promise<Record<string, Locator>> {
        if (satisfies(this.instanceMeta.version, "<6.7")) {
            throw new Error("getAvailableAddress is not supported for Shopware versions below 6.7");
        }

        const regex = this.buildAddressRegex(partialAddressData);

        if (!this.availableAddresses) {
            throw new Error("Available addresses are not defined.");
        }

        const addressContainer = this.availableAddresses.locator(".address-manager-select-address").filter({ hasText: regex }).first();

        const address = addressContainer.locator(".address");
        const addressActionsButton = addressContainer.locator("[id^='address-item-dropdown']");
        const addressActionsDropdown = addressContainer.locator(".dropdown-menu");
        const editAddressButton = addressActionsDropdown.getByRole("link", { name: translate("storefront:address:actions.editAddress") });
        const useAsDefaultShippingButton = addressActionsDropdown.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultShipping") });
        const useAsDefaultBillingButton = addressActionsDropdown.getByRole("button", { name: translate("storefront:address:actions.useAsDefaultBilling") });
        const defaultShippingAddressBadge = addressContainer.locator(".address-item-default-badge", { hasText: translate("storefront:address:badges.defaultShipping") });
        const defaultBillingAddressBadge = addressContainer.locator(".address-item-default-badge", { hasText: translate("storefront:address:badges.defaultBilling") });
        return {
            address: address,
            addressActions: addressActionsButton,
            editAddressButton: editAddressButton,
            useAsDefaultShippingButton: useAsDefaultShippingButton,
            useAsDefaultBillingButton: useAsDefaultBillingButton,
            isDefaultShippingAddress: defaultShippingAddressBadge,
            isDefaultBillingAddress: defaultBillingAddressBadge,
        };
    }

    async getDefaultShippingAddress(partialAddressData?: Partial<Address>): Promise<Locator> {
        if (satisfies(this.instanceMeta.version, "<6.7")) {
            throw new Error("getDefaultShippingAddress is not supported for Shopware versions below 6.7");
        }
        if (partialAddressData) {
            const regex = this.buildAddressRegex(partialAddressData);
            return this.page
                .locator(".address-manager-select-address")
                .filter({ hasText: regex })
                .filter({ hasText: translate("storefront:address:badges.defaultShipping") })
                .first();
        }
        return this.page.locator(".address-manager-select-address").filter({ hasText: translate("storefront:address:badges.defaultShipping") });
    }

    async getDefaultBillingAddress(partialAddressData?: Partial<Address>): Promise<Locator> {
        if (satisfies(this.instanceMeta.version, "<6.7")) {
            throw new Error("getDefaultBillingAddress is not supported for Shopware versions below 6.7");
        }
        if (partialAddressData) {
            const regex = this.buildAddressRegex(partialAddressData);
            return this.page
                .locator(".address-manager-select-address")
                .filter({ hasText: regex })
                .filter({ hasText: translate("storefront:address:badges.defaultBilling") })
                .first();
        }
        return this.page
            .locator(".address-manager-select-address")
            .filter({ hasText: translate("storefront:address:badges.defaultBilling") })
            .first();
    }
}
