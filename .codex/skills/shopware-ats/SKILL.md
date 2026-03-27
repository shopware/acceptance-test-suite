---
name: shopware-ats
description: "Work effectively in the Shopware Acceptance Test Suite repository: inspect or modify Playwright specs, merged fixtures, page objects, tasks, data fixtures, service helpers, and locale-backed assertions. Use when Codex needs to debug a failing ATS test, add or refactor Shopware end-to-end coverage, trace how exported fixtures are wired together, or choose the right file to update in `tests/`, `src/fixtures/`, `src/page-objects/`, `src/tasks/`, `src/data-fixtures/`, or `src/services/`."
---

# Shopware ATS

## Overview

Navigate the Shopware Acceptance Test Suite as a layered Playwright library, not as a flat test folder. Start from the user-visible behavior, then choose the smallest layer that should own the change and re-export it through the repo's merge points when needed.

## Start Here

Read these files first when orienting:

- `package.json` for supported toolchain and repo scripts
- `playwright.config.ts` for env defaults, web server behavior, retries, and timeouts
- `src/index.ts` for the public `test` merge stack and exported helpers
- `references/repo-map.md` for the repository layout and common edit targets

## Choose The Right Layer

Route work to the narrowest layer that owns the behavior:

- Edit `tests/` when changing spec flow, assertions, or coverage composition.
- Edit `src/page-objects/` when selectors, URLs, page affordances, or page-level helpers are wrong.
- Edit `src/tasks/` when a reusable business action spans multiple page interactions.
- Edit `src/data-fixtures/` or `src/services/TestDataService.ts` when setup data or cleanup behavior is wrong.
- Edit `src/fixtures/` when the test context, actors, API contexts, or shared lifecycle wiring must change.
- Edit `src/services/` for cross-cutting helpers, API wrappers, login flows, translation helpers, or feature gates.
- Edit `src/locales/` when assertions should rely on translated keys rather than hard-coded UI text.

If you add a new task, page object, fixture, or helper meant for public reuse, update the relevant aggregator export so it becomes reachable from `src/index.ts`.

## Implement Changes

Follow this workflow:

1. Reproduce or localize the problem with the smallest viable spec or file set.
2. Search for existing tasks, page objects, fixtures, and specs that already model the same nouns or flow before inventing a new abstraction.
3. Trace the flow from spec to actor/task/page object/service instead of patching selectors blindly.
4. Preserve existing patterns such as `test.extend`, `mergeTests`, actor-driven interactions, and locale-based assertions.
5. Keep version and SaaS branching explicit when behavior depends on `InstanceMeta`.
6. Re-export any new reusable surface from the corresponding merge file.

Prefer these local conventions:

- Import `test`, `expect`, and helper exports from `../src` in specs when exercising the public package surface.
- Prefer `ShopAdmin`, `ShopCustomer`, `AdminPage`, and similar fixtures over constructing raw pages unless a lower layer truly needs it.
- Prefer reusable task/page-object methods over duplicating long UI sequences in specs.
- Use `rg` to find existing scenario terms in `tests/`, `src/tasks/`, and `src/page-objects/` before adding a new helper.
- Prefer translated keys via `translate(...)` when the assertion is language-sensitive.
- Keep cleanup behavior compatible with `ATS_SKIP_CLEANUP`.

## Author New Coverage

When adding new ATS coverage, build from the outside in:

1. Start with the user-visible scenario in `tests/`.
2. Search for and reuse existing actors, page objects, tasks, and data fixtures before creating new ones.
3. Add a new page-object method when the interaction is page-specific and likely reusable.
4. Add a new task when the behavior spans multiple steps and should read like a business action.
5. Add or extend data fixtures only when the scenario cannot rely on default seeded state.

For new reusable coverage primitives:

- If an existing spec already owns the user-visible area, prefer extending that spec instead of creating a parallel one.
- Export new admin page objects through `src/page-objects/AdministrationPages.ts`.
- Export new storefront page objects through `src/page-objects/StorefrontPages.ts`.
- Export new admin tasks through `src/tasks/shop-admin-tasks.ts`.
- Export new storefront tasks through `src/tasks/shop-customer-tasks.ts`.
- Keep specs focused on orchestration and assertions rather than selector-heavy UI plumbing.

## Debug Failing Tests

When debugging ATS failures, narrow the failure before editing code:

1. Re-run the smallest affected Playwright spec or test block.
2. Decide whether the failure is setup, selector drift, timing, environment boot, translation, or version-gated behavior.
3. Trace the failing assertion back through spec -> actor/task -> page object -> service/fixture.
4. Inspect `playwright.config.ts` defaults before assuming the app under test is available.
5. Prefer fixing the owning abstraction instead of papering over the symptom in the spec.

Use these heuristics:

- Suspect `src/page-objects/` when locators, URLs, or affordances are stale.
- Suspect `src/tasks/` when multi-step behavior regressed but single selectors still look right.
- Suspect `src/fixtures/` or `src/services/TestDataService.ts` when login, setup, cleanup, or seeded data is wrong.
- Suspect `src/locales/` or translation usage when text assertions fail only in certain locales.
- Suspect `InstanceMeta` branches when failures differ by Shopware version or SaaS mode.

## Refactor Internals Safely

When refactoring fixtures, tasks, or page objects, keep public behavior stable:

1. Identify whether the surface is internal-only or exported through a merge file.
2. Preserve fixture names and task/page-object availability unless the user asked for a breaking change.
3. Prefer thin compatibility wrappers around new shared helpers when older exported task names are already part of the public surface.
4. Move duplicated behavior downward into reusable methods instead of pushing more logic into specs.
5. Keep `mergeTests` and `test.extend` composition readable and explicit.
6. Re-run the most affected specs plus lint, typecheck, and build before stopping.

During refactors:

- Maintain the actor model in `src/fixtures/Actors.ts` when behavior belongs to the simulated user role.
- Keep page objects responsible for structure and selectors, not end-to-end business flows.
- Keep tasks responsible for reusable multi-step flows, not raw locator definitions.
- Keep fixtures responsible for lifecycle and dependency wiring, not arbitrary UI logic.
- Preserve deprecated compatibility shims and exported task names when they already exist unless the requested change removes them intentionally.

## Validate Safely

Run the narrowest useful verification first:

- `npx playwright test tests/<spec>.spec.ts --project=chromium` for targeted behavior checks
- `npm run lint`
- `npm run typecheck`
- `npm run build`

Respect the repo's Playwright environment model:

- `APP_URL` defaults to `http://localhost:8011/`
- `ADMIN_URL` defaults to `${APP_URL}admin/`
- `SHOPWARE_ADMIN_USERNAME`, `SHOPWARE_ADMIN_PASSWORD`, and `MAILPIT_BASE_URL` have local defaults
- If `APP_URL` stays at the default and `WEBSERVER_COMMAND` is unset, Playwright starts Docker Compose automatically
- If `APP_URL` points elsewhere and `WEBSERVER_COMMAND` is unset, the config intentionally sleeps instead of booting a local stack

When debugging locally hosted behavior, verify the chosen `APP_URL` and `WEBSERVER_COMMAND` before assuming the tests are broken.

## Use The Reference

Read `references/repo-map.md` when you need:

- the repository layout at a glance
- the file that merges a given fixture or page-object family
- the most likely place to add a new reusable primitive
- a reminder of the main run and verification commands
- a quick checklist for new coverage, debugging, and refactoring work
