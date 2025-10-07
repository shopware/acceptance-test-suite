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
import { test as FeatureService } from './fixtures/Feature';
import { test as ShopwareDataFixture } from './fixtures/ShopwareDataFixtures';

// Export only runtime values from @playwright/test to avoid strip-only mode errors
export { expect, mergeTests } from '@playwright/test';
// Export types from playwright-core for strip-only mode compatibility
export type { APIResponse, Page, Locator, BrowserContext, APIRequestContext, Request } from 'playwright-core';
export * from './services/ShopwareDataHelpers';
export * from './services/ShopInfo';
export * from './services/ImageHelper';
export * from './types/ShopwareTypes';
export * from './services/TestDataService';
export * from './services/VisualTestHelpers';
export * from './services/IdProvider';
export * from './services/LanguageHelper';
export * from './services/ConsoleRunner';

export { StorefrontPageObjects } from './page-objects/StorefrontPages';
export { AdminPageObjects } from './page-objects/AdministrationPages';

export type { FixtureTypes } from './types/FixtureTypes';
export type { Task } from './types/Task';
export type { PageObject } from './types/PageObject';
export type { TranslationKey, TranslateFn } from './types/TranslationTypes';

export { BUNDLED_RESOURCES, baseNamespaces } from './locales';

export const test = mergeTests(
    HelperFixtures,
    DefaultSalesChannel,
    ShopwareDataFixture,
    ApiContexts,
    PageContexts,
    Actors,
    TestData,
    FeatureService,
    StorefrontPages,
    AdministrationPages,
    DataFixtures,
    ShopAdminTasks,
    ShopCustomerTasks,
);
