import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';
import { ExpectNotification } from './shop-admin/ExpectNotification';
import { BulkEditProducts } from './shop-admin/Product/BulkEditProducts';

export const test = mergeTests(
    SaveProduct,
    ExpectNotification,
    BulkEditProducts,
);