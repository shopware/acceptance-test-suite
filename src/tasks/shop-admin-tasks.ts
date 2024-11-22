import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';
import { ExpectNotification } from './shop-admin/ExpectNotification';
import { BulkEditOrders } from './shop-admin/Order/BulkEditOrders';

export const test = mergeTests(
    SaveProduct,
    ExpectNotification,
    BulkEditOrders
);