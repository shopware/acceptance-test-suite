import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';
import { ExpectNotification } from './shop-admin/ExpectNotification';
import { CreateLinkTypeCategory } from './shop-admin/Category/CreateLinkTypeCategory';

export const test = mergeTests(
    SaveProduct,
    ExpectNotification,
    CreateLinkTypeCategory,
);