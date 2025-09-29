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
import { FlowBuilderTemplates } from './administration/FlowBuilderTemplates';
import { FlowBuilderDetail } from './administration/FlowBuilderDetail';
import { DataSharing } from './administration/DataSharing';
import { Dashboard } from './administration/Dashboard';
import { ShippingListing } from './administration/ShippingListing';
import { ShippingDetail } from './administration/ShippingDetail';
import { PaymentDetail } from './administration/PaymentDetail';
import { LandingPageCreate } from './administration/LandingPageCreate';
import { LandingPageDetail } from './administration/LandingPageDetail';
import { Categories } from './administration/Categories';
import { CustomFieldListing } from './administration/CustomFieldListing';
import { CustomFieldCreate } from './administration/CustomFieldCreate';
import { CustomFieldDetail } from './administration/CustomFieldDetail';
import { CategoryDetail } from './administration/CategoryDetail';
import { RuleCreate } from './administration/RuleCreate';
import { RuleDetail } from './administration/RuleDetail';
import { RuleListing } from './administration/RuleListing';
import { ManufacturerCreate } from './administration/ManufacturerCreate';
import { ManufacturerListing } from './administration/ManufacturerListing';
import { ManufacturerDetail } from './administration/ManufacturerDetail';
import { ProductListing } from './administration/ProductListing';
import { ProductBulkEdit } from './administration/ProductBulkEdit';
import { CustomerBulkEdit } from './administration/CustomerBulkEdit';
import { SettingsListing } from './administration/SettingsListing';
import { DocumentListing } from './administration/DocumentListing';
import { DocumentDetail } from './administration/DocumentDetail';
import { ShopwareServices } from './administration/ShopwareServices';
import { PromotionsListing } from './administration/PromotionListing';
import { PromotionCreate } from './administration/PromotionCreate';
import { PromotionDetail } from './administration/PromotionDetail';
import { Media } from './administration/Media';
import { YourProfile } from './administration/YourProfile';
import { ThemesListing } from './administration/ThemesListing';
import { ThemesDetail } from './administration/ThemesDetail';
import { MediaListing } from './administration/MediaListing';
import {LayoutListing} from './administration/LayoutListing';
import { LayoutCreate } from './administration/LayoutCreate';
import { ListingPageLayoutDetail } from './administration/ListingPageLayoutDetail';

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
    AdminFlowBuilderTemplates: FlowBuilderTemplates;
    AdminFlowBuilderDetail: FlowBuilderDetail;
    AdminDataSharing: DataSharing;
    AdminDashboard: Dashboard;
    AdminShippingListing: ShippingListing;
    AdminShippingDetail: ShippingDetail;
    AdminPaymentDetail: PaymentDetail;
    AdminCategories: Categories;
    AdminCategoryDetail: CategoryDetail;
    AdminLandingPageCreate: LandingPageCreate;
    AdminLandingPageDetail: LandingPageDetail;
    AdminCustomFieldListing: CustomFieldListing;
    AdminCustomFieldCreate: CustomFieldCreate;
    AdminCustomFieldDetail: CustomFieldDetail;
    AdminRuleDetail: RuleDetail;
    AdminRuleCreate: RuleCreate;
    AdminRuleListing: RuleListing;
    AdminManufacturerCreate: ManufacturerCreate,
    AdminManufacturerListing: ManufacturerListing,
    AdminManufacturerDetail: ManufacturerDetail,
    AdminProductListing: ProductListing;
    AdminProductBulkEdit: ProductBulkEdit;
    AdminCustomerBulkEdit: CustomerBulkEdit;
    AdminSettingsListing: SettingsListing;
    AdminDocumentListing: DocumentListing;
    AdminDocumentDetail: DocumentDetail;
    AdminPromotionsListing: PromotionsListing;
    AdminPromotionCreate: PromotionCreate;
    AdminPromotionDetail: PromotionDetail;
    AdminShopwareServices: ShopwareServices;
    AdminMedia: Media;
    AdminYourProfile: YourProfile;
    AdminThemesListing: ThemesListing;
    AdminThemesDetail: ThemesDetail;
    AdminMediaListing: MediaListing;
    AdminLayoutListing: LayoutListing
    AdminListingPageLayoutDetail: ListingPageLayoutDetail;
    AdminLayoutCreate: LayoutCreate;
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
    FlowBuilderTemplates,
    FlowBuilderDetail,
    Dashboard,
    DataSharing,
    ShippingListing,
    ShippingDetail,
    PaymentDetail,
    Categories,
    CategoryDetail,
    LandingPageCreate,
    LandingPageDetail,
    CustomFieldListing,
    CustomFieldCreate,
    CustomFieldDetail,
    RuleCreate,
    RuleDetail,
    RuleListing,
    ManufacturerCreate,
    ManufacturerDetail,
    ManufacturerListing,
    ProductListing,
    ProductBulkEdit,
    CustomerBulkEdit,
    SettingsListing,
    DocumentListing,
    DocumentDetail,
    ShopwareServices,
    PromotionsListing,
    PromotionCreate,
    PromotionDetail,
    Media,
    YourProfile,
    ThemesListing,
    ThemesDetail,
    MediaListing,
    LayoutListing,
    ListingPageLayoutDetail,
    LayoutCreate,
}

export const test = base.extend<FixtureTypes>({

    AdminProductDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new ProductDetail(AdminPage, InstanceMeta));
    },

    AdminOrderDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new OrderDetail(AdminPage, InstanceMeta));
    },

    AdminCustomerListing: async ({ AdminPage }, use) => {
        await use(new CustomerListing(AdminPage));
    },

    AdminCustomerDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new CustomerDetail(AdminPage, InstanceMeta));
    },

    AdminCustomerGroupListing: async ({ AdminPage }, use) => {
        await use(new CustomerGroupListing(AdminPage));
    },

    AdminCustomerGroupCreate: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new CustomerGroupCreate(AdminPage, InstanceMeta));
    },

    AdminCustomerGroupDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new CustomerGroupDetail(AdminPage, InstanceMeta));
    },

    AdminFirstRunWizard: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new FirstRunWizard(AdminPage, InstanceMeta));
    },

    AdminFlowBuilderCreate: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new FlowBuilderCreate(AdminPage, InstanceMeta));
    },

    AdminFlowBuilderListing: async ({ AdminPage }, use) => {
        await use(new FlowBuilderListing(AdminPage));
    },

    AdminFlowBuilderTemplates: async ({ AdminPage }, use) => {
        await use(new FlowBuilderTemplates(AdminPage));
    },

    AdminFlowBuilderDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new FlowBuilderDetail(AdminPage, InstanceMeta));
    },

    AdminDataSharing: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new DataSharing(AdminPage, InstanceMeta));
    },

    AdminDashboard: async ({ AdminPage }, use) => {
        await use(new Dashboard(AdminPage));
    },

    AdminShippingListing: async ({ AdminPage }, use) => {
        await use(new ShippingListing(AdminPage));
    },

    AdminShippingDetail: async ({ AdminPage }, use) => {
        await use(new ShippingDetail(AdminPage));
    },

    AdminPaymentDetail: async ({ AdminPage }, use) => {
        await use(new PaymentDetail(AdminPage));
    },

    AdminCategories: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new Categories(AdminPage, InstanceMeta));
    },

    AdminCategoryDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new CategoryDetail(AdminPage, InstanceMeta));
    },

    AdminLandingPageDetail: async ({ AdminPage }, use) => {
        await use(new LandingPageDetail(AdminPage));
    },

    AdminLandingPageCreate: async ({ AdminPage }, use) => {
        await use(new LandingPageCreate(AdminPage));
    },

    AdminCustomFieldListing: async ({ AdminPage }, use) => {
        await use(new CustomFieldListing(AdminPage));
    },

    AdminCustomFieldCreate: async ({ AdminPage }, use) => {
        await use(new CustomFieldCreate(AdminPage));
    },

    AdminCustomFieldDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new CustomFieldDetail(AdminPage, InstanceMeta));
    },

    AdminRuleCreate: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new RuleCreate(AdminPage, InstanceMeta));
    },

    AdminRuleDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new RuleDetail(AdminPage, InstanceMeta));
    },

    AdminRuleListing: async ({ AdminPage }, use) => {
        await use(new RuleListing(AdminPage));
    },

    AdminManufacturerListing: async ({ AdminPage }, use) => {
        await use(new ManufacturerListing(AdminPage));
    },

    AdminManufacturerCreate: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new ManufacturerCreate(AdminPage, InstanceMeta));
    },

    AdminManufacturerDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new ManufacturerDetail(AdminPage, InstanceMeta));
    },

    AdminProductListing: async ({ AdminPage }, use) => {
        await use(new ProductListing(AdminPage));
    },

    AdminProductBulkEdit: async ({ AdminPage }, use) => {
        await use(new ProductBulkEdit(AdminPage));
    },

    AdminCustomerBulkEdit: async ({ AdminPage }, use) => {
        await use(new CustomerBulkEdit(AdminPage));
    },

    AdminSettingsListing: async ({ AdminPage }, use) => {
        await use(new SettingsListing(AdminPage));
    },

    AdminDocumentListing: async ({ AdminPage }, use) => {
        await use(new DocumentListing(AdminPage));
    },

    AdminDocumentDetail: async ({ AdminPage }, use) => {
        await use(new DocumentDetail(AdminPage));
    },

    AdminPromotionsListing: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new PromotionsListing(AdminPage, InstanceMeta));
    },

    AdminPromotionCreate: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new PromotionCreate(AdminPage, InstanceMeta));
    },

    AdminPromotionDetail: async ({ AdminPage, InstanceMeta }, use) => {
        await use(new PromotionDetail(AdminPage, InstanceMeta));
    },

    AdminMedia: async ({ AdminPage }, use) => {
        await use(new Media(AdminPage));
    },
    
    AdminShopwareServices: async ({ AdminPage }, use) => {
        await use(new ShopwareServices(AdminPage));
    },

    AdminYourProfile: async ({ AdminPage }, use) => {
        await use(new YourProfile(AdminPage));
    },
    AdminThemesListing: async ({ AdminPage }, use) => {
        await use(new ThemesListing(AdminPage));
    },

    AdminThemesDetail: async ({ AdminPage }, use) => {
        await use(new ThemesDetail(AdminPage));
    },

    AdminMediaListing: async ({ AdminPage }, use) => {
        await use(new MediaListing(AdminPage));
    },

    AdminLayoutListing: async ({ AdminPage }, use) => {
        await use(new LayoutListing(AdminPage));
    },

    AdminListingPageLayoutDetail: async ({ AdminPage }, use) => {
        await use(new ListingPageLayoutDetail(AdminPage));
    },

    AdminLayoutCreate: async ({ AdminPage }, use) => {
        await use(new LayoutCreate(AdminPage));
    },
});
