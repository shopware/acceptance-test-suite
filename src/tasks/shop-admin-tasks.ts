import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';
import { ExpectNotification } from './shop-admin/ExpectNotification';
import { CreateLinkTypeCategory } from './shop-admin/Category/CreateLinkTypeCategory';
import { SetSystemConfigValues } from './shop-admin/Settings/SetSystemConfigValues';
import { BulkEditProducts } from './shop-admin/Product/BulkEditProducts';

export const test = mergeTests(
    SaveProduct,
    ExpectNotification
);