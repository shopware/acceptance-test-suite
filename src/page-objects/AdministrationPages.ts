import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { ProductDetail } from './administration/ProductDetail';
import { OrderDetail } from './administration/OrderDetail';
import { CustomerDetail } from './administration/CustomerDetail';
import { FirstRunWizard } from './administration/FirstRunWizard';
import { FlowBuilderCreate } from './administration/FlowBuilderCreate';
import { FlowBuilderListing } from './administration/FlowBuilderListing';
import { FlowBuilderDetail } from './administration/FlowBuilderDetail';
import { DataSharing } from './administration/DataSharing';
import { Dashboard } from './administration/Dashboard';
import { ShippingListing } from './administration/ShippingListing';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    AdminOrderDetail: OrderDetail;
    AdminCustomerDetail: CustomerDetail;
    AdminFirstRunWizard: FirstRunWizard;
    AdminFlowBuilderCreate: FlowBuilderCreate;
    AdminFlowBuilderListing: FlowBuilderListing;
    AdminFlowBuilderDetail: FlowBuilderDetail;
    AdminDataSharing: DataSharing;
    AdminDashboard: Dashboard;
    AdminShippingListing: ShippingListing;
}

export const AdminPageObjects = {
    ProductDetail,
    OrderDetail,
    CustomerDetail,
    FirstRunWizard,
    FlowBuilderCreate,
    FlowBuilderListing,
    FlowBuilderDetail,
    Dashboard,
    DataSharing,
    ShippingListing,
    
}

export const test = base.extend<FixtureTypes>({

    AdminProductDetail: async ({ AdminPage }, use) => {
        await use(new ProductDetail(AdminPage));
    },

    AdminOrderDetail: async ({ AdminPage }, use) => {
        await use(new OrderDetail(AdminPage));
    },

    AdminCustomerDetail: async ({ AdminPage }, use) => {
        await use(new CustomerDetail(AdminPage));
    },

    AdminFirstRunWizard: async ({ AdminPage }, use) => {
        await use(new FirstRunWizard(AdminPage));
    },

    AdminFlowBuilderCreate: async ({ AdminPage }, use) => {
        await use(new FlowBuilderCreate(AdminPage));
    },

    AdminFlowBuilderListing: async ({ AdminPage }, use) => {
        await use(new FlowBuilderListing(AdminPage));
    },

    AdminFlowBuilderDetail: async ({ AdminPage }, use) => {
        await use(new FlowBuilderDetail(AdminPage));
    },

    AdminDataSharing: async ({ AdminPage }, use) => {
        await use(new DataSharing(AdminPage));
    },

    AdminDashboard: async ({ AdminPage }, use) => {
        await use(new Dashboard(AdminPage));
    },

    AdminShippingListing: async ({ AdminPage }, use) => {
        await use(new ShippingListing(AdminPage));
    },
});
