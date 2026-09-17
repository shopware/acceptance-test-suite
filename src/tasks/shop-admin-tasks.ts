import { mergeTests } from "@playwright/test";

import { SaveProduct } from "./shop-admin/Product/SaveProduct";
import { SaveAndDuplicateProduct } from "./shop-admin/Product/SaveAndDuplicateProduct";
import { FillProductBaseData } from "./shop-admin/Product/FillProductBaseData";
import { ExpectNotification } from "./shop-admin/ExpectNotification";
import { CreateLinkTypeCategory } from "./shop-admin/Category/CreateLinkTypeCategory";
import { BulkEditProducts } from "./shop-admin/Product/BulkEditProducts";
import { BulkEditCustomers } from "./shop-admin/Customers/BulkEditCustomers";
import { AssignEntitiesToRule } from "./shop-admin/Rule/AssignEntitiesToRule";
import { CreateFlow } from "./shop-admin/Flow/CreateFlow";
import { LoginViaReviewsTab } from "./shop-customer/Account/LoginViaReviewsTab";
import { DeactivateShopwareServices } from "./shop-admin/ShopwareServices/DeactivateShopwareServices";
import { CheckVisibilityOfServicesBanner } from "./shop-admin/ShopwareServices/CheckVisibilityOfServicesBanner";
import { CheckAccessToShopwareServices } from "./shop-admin/ShopwareServices/CheckAccessToShopwareServices";
import { SelectExtensionCategory } from "./shop-admin/FRW/SelectExtensionCategory";

export const test = mergeTests(
    SaveProduct,
    SaveAndDuplicateProduct,
    FillProductBaseData,
    ExpectNotification,
    CreateLinkTypeCategory,
    BulkEditProducts,
    BulkEditCustomers,
    AssignEntitiesToRule,
    CreateFlow,
    LoginViaReviewsTab,
    CheckAccessToShopwareServices,
    CheckVisibilityOfServicesBanner,
    DeactivateShopwareServices,
    SelectExtensionCategory
);
