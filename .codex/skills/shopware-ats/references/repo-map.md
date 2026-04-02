# Shopware ATS Repo Map

## Overview

Use this reference to quickly decide where a change belongs in the Shopware Acceptance Test Suite.

## Primary Entry Points

- `package.json`: toolchain, engine range, repo scripts
- `playwright.config.ts`: env defaults, Playwright settings, and webServer boot behavior
- `src/index.ts`: public exports and merged `test` stack
- `tests/`: public-facing specs that exercise the package

## Public Export Surfaces

- `src/index.ts`: public runtime exports and public type exports
- `src/page-objects/AdministrationPages.ts`: administration page-object merge file
- `src/page-objects/StorefrontPages.ts`: storefront page-object merge file
- `src/tasks/shop-admin-tasks.ts`: administration task merge file
- `src/tasks/shop-customer-tasks.ts`: storefront task merge file
- `src/types/FixtureTypes.ts`: merged fixture type surface

## Repository Layers

### Specs

- `tests/*.spec.ts`
- Assert user-visible behavior
- Import from `../src` to validate the public package surface

### Fixtures

- `src/fixtures/*.ts`
- Build shared test context such as actors, API contexts, page contexts, feature gates, and test data lifecycle
- Merge into the public `test` in `src/index.ts`

### Page Objects

- `src/page-objects/administration/*`
- `src/page-objects/storefront/*`
- `src/page-objects/AdministrationPages.ts`
- `src/page-objects/StorefrontPages.ts`
- Hold selectors, URLs, and page-scoped helpers
- Re-export new page objects through the family merge file

### Tasks

- `src/tasks/shop-admin/*`
- `src/tasks/shop-customer/*`
- `src/tasks/shop-admin-tasks.ts`
- `src/tasks/shop-customer-tasks.ts`
- Hold reusable higher-level actions that combine multiple page interactions
- Re-export new tasks through the corresponding merge file

### Services And Test Data

- `src/services/TestDataService.ts`
- `src/services/*`
- Own API-backed setup, cleanup, shared helpers, low-level integrations, and new test data creation

### Legacy Data Fixtures

- `src/data-fixtures/*`
- Existing compatibility surface for older fixture-style setup helpers
- Do not add new usage when `src/services/TestDataService.ts` can own the behavior

### Types

- `src/types/*`
- Define shared fixture, page-object, task, translation, and Shopware domain types

### Locales

- `src/locales/en/*`
- `src/locales/de/*`
- Keep UI assertions language-aware

## Common Change Paths

### Add A New Reusable Admin Flow

1. Add or update the necessary admin page object in `src/page-objects/administration/`
2. Add a reusable task in `src/tasks/shop-admin/`
3. Export the task in `src/tasks/shop-admin-tasks.ts`
4. Update or add a spec in `tests/`

### Add A New Reusable Storefront Flow

1. Add or update the storefront page object in `src/page-objects/storefront/`
2. Add a reusable storefront task in `src/tasks/shop-customer/`
3. Export the task in `src/tasks/shop-customer-tasks.ts`
4. Update or add a spec in `tests/`

### Add Or Refine Test Data Or Service Logic

1. Prefer `src/services/TestDataService.ts` for entity creation, mutation, and cleanup used by new coverage
2. Use another file in `src/services/` when the helper is broader than test data setup
3. Re-export public helpers through `src/index.ts` when needed
4. Update the consuming fixture, task, page object, or spec

### Add Or Refine Shared Types

1. Update the relevant file in `src/types/`
2. Keep `src/types/FixtureTypes.ts` aligned when fixture, page-object, or task surfaces change
3. Keep `src/index.ts` type exports aligned when public types change
4. Run `npm run typecheck`

### Fix Setup Or Cleanup Issues

1. Check `src/fixtures/TestData.ts` for cleanup gating (`ATS_SKIP_CLEANUP`)
2. Check `src/services/TestDataService.ts` for entity creation or cleanup logic
3. Check supporting API helpers in `src/services/`
4. Inspect `src/data-fixtures/` only when maintaining existing legacy compatibility

### Fix Broken Selectors Or Labels

1. Update the relevant page object
2. Update locale files when assertions depend on translated keys
3. Avoid scattering literal selectors or strings into specs

## Workflow Checklists

### Author New ATS Coverage

1. Start with a spec in `tests/`
2. Search with `rg` for existing scenario nouns and reuse existing fixtures from `src/index.ts` exports whenever possible
3. Use `TestDataService` for generated entities and cleanup; do not introduce new `src/data-fixtures/` usage for new work
4. Add page-object support in the relevant `src/page-objects/` subtree
5. Add a task only if the scenario becomes a reusable flow
6. Export new reusable pieces through the appropriate merge file or `src/index.ts`

### Debug Failing Tests

1. Re-run the narrowest spec
2. Check environment defaults and app boot assumptions in `playwright.config.ts`
3. Trace failure ownership through spec, task, page object, fixture, service, and type surface when signatures are involved
4. Fix the owning abstraction
5. Re-run the targeted spec before broader verification

### Refactor Fixtures, Tasks, Page Objects, Services, Or Types

1. Identify which merge file or public export surface exposes the behavior
2. Preserve names and exports unless a breaking change is intended
3. Prefer thin wrappers around new shared helpers when exported task names already exist
4. Prefer `TestDataService` over adding new `data-fixtures` for new setup paths
5. Keep roles clear: fixtures wire context, page objects model pages, tasks model flows, services provide helpers, and types define contracts
6. Re-run targeted specs plus repo checks

## Verification Commands

- `npx playwright test tests/<spec>.spec.ts --project=chromium`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Environment Defaults

- `APP_URL=http://localhost:8011/`
- `ADMIN_URL=${APP_URL}admin/` unless overridden
- `MAILPIT_BASE_URL=http://localhost:8013`
- `SHOPWARE_ADMIN_USERNAME=admin`
- `SHOPWARE_ADMIN_PASSWORD=shopware`

If `WEBSERVER_COMMAND` is unset:

- default `APP_URL` causes Playwright to run `docker compose up --pull=always --quiet-pull`
- non-default `APP_URL` causes Playwright to use `sleep 999d` and assume an external Shopware instance already exists

Check those values first when tests fail before the browser reaches the expected app.
