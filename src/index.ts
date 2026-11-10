import { mergeTests, type TestType } from "@playwright/test";
import type { StorefrontWorkerOptions } from "./services/StorefrontTarget";
import type { StorefrontTargetFixtures } from "./fixtures/StorefrontTarget";
import type { DefaultSalesChannelTypes } from "./fixtures/DefaultSalesChannel";
import type { ApiContextTypes } from "./fixtures/ApiContexts";
import type { ShopwareDataFixtureTypes } from "./fixtures/ShopwareDataFixtures";
import type { HelperFixtureTypes } from "./fixtures/HelperFixtures";
import type { StorefrontCustomerFixtures } from "./fixtures/StorefrontCustomer";
import { test as DefaultSalesChannel } from "./fixtures/DefaultSalesChannel";
import { test as ApiContexts } from "./fixtures/ApiContexts";
import { test as PageContexts } from "./fixtures/PageContexts";
import { test as Actors } from "./fixtures/Actors";
import { test as TestData } from "./fixtures/TestData";
import { test as HelperFixtures } from "./fixtures/HelperFixtures";
import { test as StorefrontPages } from "./page-objects/StorefrontPages";
import { test as AdministrationPages } from "./page-objects/AdministrationPages";
import { test as DataFixtures } from "./data-fixtures/DataFixtures";
import { test as ShopAdminTasks } from "./tasks/shop-admin-tasks";
import { test as ShopCustomerTasks } from "./tasks/shop-customer-tasks";
import { test as FeatureService } from "./fixtures/Feature";
import { test as ShopwareDataFixture } from "./fixtures/ShopwareDataFixtures";
import { test as StorefrontTarget } from "./fixtures/StorefrontTarget";
import { test as StorefrontCustomer } from "./fixtures/StorefrontCustomer";

import "./fixtures/CustomMatchers";

// Export only runtime values from @playwright/test to avoid strip-only mode errors
export { expect, mergeTests } from "@playwright/test";
// Export types from playwright-core for strip-only mode compatibility
export type { APIResponse, Page, Locator, BrowserContext, APIRequestContext, Request } from "playwright-core";
export * from "./services/ShopwareDataHelpers";
export * from "./services/ShopInfo";
export * from "./services/ImageHelper";
export * from "./types/ShopwareTypes";
export * from "./services/TestDataService";
export * from "./services/VisualTestHelpers";
export * from "./services/IdProvider";
export * from "./services/LanguageHelper";
export * from "./services/FeatureService";
export * from "./services/Cache";
export * from "./services/ApiMocks";
export * from "./services/Actor";
export * from "./services/AdminLoginHelper";

export { StorefrontPageObjects } from "./page-objects/StorefrontPages";
export { AdminPageObjects } from "./page-objects/AdministrationPages";
export { uploadRandomPngMedia } from './helpers/UploadMedia';
export type { UploadMediaTarget } from './helpers/UploadMedia';

export type { FixtureTypes } from "./types/FixtureTypes";
export type { Task } from "./types/Task";
export type { PageObject } from "./types/PageObject";
export type { TranslationKey, TranslateFn } from "./types/TranslationTypes";

export { BUNDLED_RESOURCES, baseNamespaces } from "./locales";

const mergedTest = mergeTests(
    StorefrontTarget,
    StorefrontCustomer,
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
    ShopCustomerTasks
);

export type { StorefrontTarget, StorefrontWorkerOptions, StorefrontCustomerOptions } from "./services/StorefrontTarget";

// The historical merged fixture interfaces include worker fixtures in the test args too.
// Expose their actual scopes so consumers can override worker options with test.extend().
type WorkerScopedFixtures = StorefrontWorkerOptions &
    StorefrontTargetFixtures &
    StorefrontCustomerFixtures &
    DefaultSalesChannelTypes &
    ApiContextTypes &
    ShopwareDataFixtureTypes &
    HelperFixtureTypes & { AdminSession: unknown };
type PublicTest<T> = T extends TestType<infer TestArgs, infer WorkerArgs> ? TestType<Omit<TestArgs, keyof WorkerScopedFixtures>, WorkerArgs> : never;
export const test = mergedTest as PublicTest<typeof mergedTest>;
