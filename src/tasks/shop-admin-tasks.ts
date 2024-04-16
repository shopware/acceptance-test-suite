import { mergeTests } from '@playwright/test';

import { SaveProduct } from './shop-admin/Product/SaveProduct';

export const test = mergeTests(
    SaveProduct
);