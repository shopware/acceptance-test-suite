import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { ProductDetail } from './administration/ProductDetail';
import { OrderDetail } from './administration/OrderDetail';
import { CustomerDetail } from './administration/CustomerDetail';
import { FirstRunWizard } from './administration/FirstRunWizard';
import { FlowBuilderCreate } from './administration/FlowBuilderCreate';
import { FlowBuilderListing } from './administration/FlowBuilderListing';
import { DataSharing } from './administration/DataSharing';
import { Dashboard } from './administration/Dashboard';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    AdminOrderDetail: OrderDetail;
    AdminCustomerDetail: CustomerDetail;
    AdminFirstRunWizard: FirstRunWizard;
    AdminFlowBuilderCreate: FlowBuilderCreate;
    AdminFlowBuilderListing: FlowBuilderListing;
    AdminDataSharing: DataSharing;
    AdminDashboard: Dashboard;
}

export const AdminPageObjects = {
    ProductDetail,
    OrderDetail,
    CustomerDetail,
    FirstRunWizard,
    FlowBuilderCreate,
    FlowBuilderListing,
    Dashboard,
    DataSharing,
}

export const test = base.extend<FixtureTypes>({

    AdminProductDetail: async ({ AdminPage, ProductData }, use) => {
        await use(new ProductDetail(AdminPage, ProductData));
    },

    AdminOrderDetail: async ({ AdminPage, OrderData }, use) => {
        await use(new OrderDetail(AdminPage, OrderData));
    },

    AdminCustomerDetail: async ({ AdminPage, DefaultSalesChannel}, use) => {
        await use(new CustomerDetail(AdminPage, DefaultSalesChannel.customer));
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

    AdminDataSharing: async ({ AdminPage }, use) => {
        await use(new DataSharing(AdminPage));
    },

    AdminDashboard: async ({ AdminPage }, use) => {
        await use(new Dashboard(AdminPage));
    },
});
