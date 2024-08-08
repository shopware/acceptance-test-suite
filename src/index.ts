import { mergeTests } from '@playwright/test';
import { test as DefaultSalesChannel } from './fixtures/DefaultSalesChannel';
import { test as ApiContexts } from './fixtures/ApiContexts';
import { test as PageContexts } from './fixtures/PageContexts';
import { test as Actors } from './fixtures/Actors';
import { test as TestData } from './fixtures/TestData';
import { test as HelperFixtures } from './fixtures/HelperFixtures';
import { test as StorefrontPages } from './page-objects/StorefrontPages';
import { test as AdministrationPages } from './page-objects/AdministrationPages';
import { test as DataFixtures } from './data-fixtures/DataFixtures';
import { test as ShopAdminTasks } from './tasks/shop-admin-tasks';
import { test as ShopCustomerTasks } from './tasks/shop-customer-tasks';
import { test as BusinessPartner } from './tasks/shop-customer-tasks';
import { test as EmployeeTasks } from './tasks/shop-customer-tasks';

export * from '@playwright/test';
export * from './services/ShopwareDataHelpers';
export * from './services/ShopInfo';
export * from './services/ImageHelper';
export * from './types/ShopwareTypes';
export * from './services/TestDataService';

export { StorefrontPageObjects } from './page-objects/StorefrontPages';
export { AdminPageObjects } from './page-objects/AdministrationPages';

export type { FixtureTypes } from './types/FixtureTypes';
export type { Task } from './types/Task';
export type { PageObject } from './types/PageObject';

export const test = mergeTests(
    HelperFixtures,
    DefaultSalesChannel,
    ApiContexts,
    PageContexts,
    Actors,
    TestData,
    StorefrontPages,
    AdministrationPages,
    DataFixtures,
    ShopAdminTasks,
    ShopCustomerTasks,
    BusinessPartner,
    EmployeeTasks,
);
