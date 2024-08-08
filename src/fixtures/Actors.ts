import { test as base } from '@playwright/test';
import { Actor } from '../services/Actor';
import type { FixtureTypes } from '../types/FixtureTypes';

export interface ActorFixtureTypes {
    ShopCustomer: Actor;
    ShopAdmin: Actor;
    BusinessPartner: Actor;
    Employee: Actor;
}

export const test = base.extend<FixtureTypes>({
    ShopCustomer: async ({ StorefrontPage }, use) => {
        const shopCustomer = new Actor('Shop customer', StorefrontPage);

        await use(shopCustomer);
    },

    ShopAdmin: async ({ AdminPage }, use) => {
        const shopAdmin = new Actor('Shop administrator', AdminPage);

        await use(shopAdmin);
    },

    BusinessPartner: async ({ StorefrontPage }, use) => {
        const businessPartner = new Actor('Business partner', StorefrontPage);

        await use(businessPartner);
    },

    Employee: async ({ StorefrontPage }, use) => {
        const employee = new Actor('Employee', StorefrontPage);

        await use(employee);
    },
});