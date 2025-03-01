import { test as base, expect } from '@playwright/test';
import type { Task } from '../../../types/Task';
import type { FixtureTypes} from '../../../types/FixtureTypes';
import { Order } from 'src/types/ShopwareTypes';

export const BulkEditOrders = base.extend<{ BulkEditOrders: Task }, FixtureTypes>({
    BulkEditOrders: async ({ AdminOrderBulkEdit, AdminOrderListing }, use ) => {
        const task = (order: Order[], changes: Record<string, Change> ) => {
            return async function BulkEditOrders() {


            };
        };

        await use(task);
    },
});
