import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';
import { ExpectNotification } from './shop-admin/ExpectNotification';
import { BulkEditOrders } from './shop-admin/Order/BulkEditOrders';
import { CreateLinkTypeCategory } from './shop-admin/Category/CreateLinkTypeCategory';
import { BulkEditProducts } from './shop-admin/Product/BulkEditProducts';
import { BulkEditCustomers } from './shop-admin/Customers/BulkEditCustomers';
import { AssignEntitiesToRule } from './shop-admin/Rule/AssignEntitiesToRule';

export const test = mergeTests(
    SaveProduct,
    ExpectNotification,
    CreateLinkTypeCategory,
    BulkEditProducts,
    BulkEditOrders,
    BulkEditCustomers,
    AssignEntitiesToRule,
);