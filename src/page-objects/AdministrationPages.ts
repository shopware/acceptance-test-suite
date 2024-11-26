import { test as base } from '@playwright/test';
import type { FixtureTypes } from '../types/FixtureTypes';

import { ProductDetail } from './administration/ProductDetail';
import { OrderDetail } from './administration/OrderDetail';
import { CustomerListing } from './administration/CustomerListing';
import { CustomerDetail } from './administration/CustomerDetail';
import { CustomerGroupListing } from './administration/CustomerGroupListing';
import { CustomerGroupCreate } from './administration/CustomerGroupCreate';
import { CustomerGroupDetail } from './administration/CustomerGroupDetail';
import { FirstRunWizard } from './administration/FirstRunWizard';
import { FlowBuilderCreate } from './administration/FlowBuilderCreate';
import { FlowBuilderListing } from './administration/FlowBuilderListing';
import { FlowBuilderDetail } from './administration/FlowBuilderDetail';
import { DataSharing } from './administration/DataSharing';
import { Dashboard } from './administration/Dashboard';
import { ShippingListing } from './administration/ShippingListing';
import { LandingPageCreate } from './administration/LandingPageCreate';
import { LandingPageDetail } from './administration/LandingPageDetail';
import { Categories } from './administration/Categories';
import { RuleDetail } from './administration/RuleDetail';
import { CustomFieldListing } from './administration/CustomFieldListing';
import { CustomFieldCreate } from './administration/CustomFieldCreate';
import { CustomFieldDetail } from './administration/CustomFieldDetail';
import { CategoryDetail } from './administration/CategoryDetail';
import { RuleCreate } from './administration/RuleCreate';
import { ManufacturerCreate } from './administration/ManufacturerCreate';
import { ManufacturerListing } from './administration/ManufacturerListing';
import { ManufacturerDetail } from './administration/ManufacturerDetail';

export interface AdministrationPageTypes {
    AdminProductDetail: ProductDetail;
    AdminOrderDetail: OrderDetail;
    AdminCustomerListing: CustomerListing;
    AdminCustomerDetail: CustomerDetail;
    AdminCustomerGroupListing: CustomerGroupListing;
    AdminCustomerGroupCreate: CustomerGroupCreate;
    AdminCustomerGroupDetail: CustomerGroupDetail;
    AdminFirstRunWizard: FirstRunWizard;
    AdminFlowBuilderCreate: FlowBuilderCreate;
    AdminFlowBuilderListing: FlowBuilderListing;
    AdminFlowBuilderDetail: FlowBuilderDetail;
    AdminDataSharing: DataSharing;
    AdminDashboard: Dashboard;
    AdminShippingListing: ShippingListing;
    AdminCategories: Categories;
    AdminCategoryDetail: CategoryDetail;
    AdminLandingPageCreate: LandingPageCreate;
    AdminLandingPageDetail: LandingPageDetail;
    AdminRuleDetail: RuleDetail;
    AdminRuleCreate: RuleCreate;
    AdminCustomFieldListing: CustomFieldListing;
    AdminCustomFieldCreate: CustomFieldCreate;
    AdminCustomFieldDetail: CustomFieldDetail;
    AdminManufacturerCreate: ManufacturerCreate,
    AdminManufacturerListing: ManufacturerListing,
    AdminManufacturerDetail: ManufacturerDetail,
}

export const AdminPageObjects = {
    ProductDetail,
    OrderDetail,
    CustomerListing,
    CustomerDetail,
    CustomerGroupListing,
    CustomerGroupCreate,
    CustomerGroupDetail,
    FirstRunWizard,
    FlowBuilderCreate,
    FlowBuilderListing,
    FlowBuilderDetail,
    Dashboard,
    DataSharing,
    ShippingListing,
    Categories,
    CategoryDetail,
    LandingPageCreate,
    LandingPageDetail,
    RuleDetail,
    RuleCreate,
    CustomFieldListing,
    CustomFieldCreate,
    CustomFieldDetail,
    ManufacturerCreate,
    ManufacturerDetail,
    ManufacturerListing,
}

export const test = base.extend<FixtureTypes>({

    AdminProductDetail: async ({ AdminPage }, use) => {
        await use(new ProductDetail(AdminPage));
    },

    AdminOrderDetail: async ({ AdminPage }, use) => {
        await use(new OrderDetail(AdminPage));
    },

    AdminCustomerListing: async ({ AdminPage }, use) => {
        await use(new CustomerListing(AdminPage));
    },

    AdminCustomerDetail: async ({ AdminPage }, use) => {
        await use(new CustomerDetail(AdminPage));
    },

    AdminCustomerGroupListing: async ({ AdminPage }, use) => {
        await use(new CustomerGroupListing(AdminPage));
    },

    AdminCustomerGroupCreate: async ({ AdminPage }, use) => {
        await use(new CustomerGroupCreate(AdminPage));
    },

    AdminCustomerGroupDetail: async ({ AdminPage }, use) => {
        await use(new CustomerGroupDetail(AdminPage));
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

    AdminCategories: async ({ AdminPage }, use) => {
        await use(new Categories(AdminPage));
    },

    AdminCategoryDetail: async ({ AdminPage }, use) => {
        await use(new CategoryDetail(AdminPage));
    },

    AdminLandingPageDetail: async ({ AdminPage }, use) => {
        await use(new LandingPageDetail(AdminPage));
    },

    AdminLandingPageCreate: async ({ AdminPage }, use) => {
        await use(new LandingPageCreate(AdminPage));
    },

    AdminRuleDetail: async ({ AdminPage }, use) => {
        await use(new RuleDetail(AdminPage));
    },

    AdminRuleCreate: async ({ AdminPage }, use) => {
        await use(new RuleCreate(AdminPage));
    },

    AdminCustomFieldListing: async ({ AdminPage }, use) => {
        await use(new CustomFieldListing(AdminPage));
    },

    AdminCustomFieldCreate: async ({ AdminPage }, use) => {
        await use(new CustomFieldCreate(AdminPage));
    },

    AdminCustomFieldDetail: async ({ AdminPage }, use) => {
        await use(new CustomFieldDetail(AdminPage));
    },

    AdminManufacturerListing: async ({ AdminPage }, use) => {
        await use(new ManufacturerListing(AdminPage));
    },

    AdminManufacturerCreate: async ({ AdminPage }, use) => {
        await use(new ManufacturerCreate(AdminPage));
    },

    AdminManufacturerDetail: async ({ AdminPage }, use) => {
        await use(new ManufacturerDetail(AdminPage));
    },
});