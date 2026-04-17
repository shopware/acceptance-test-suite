---
name: shopware-ats
description: "Work effectively in the Shopware Acceptance Test Suite repository: inspect or modify Playwright specs, merged fixtures, page objects, tasks, service helpers, shared types, and locale-backed assertions. Use when Codex needs to debug a failing ATS test, add or refactor Shopware end-to-end coverage, trace how exported fixtures are wired together, or choose the right file to update in `tests/`, `src/fixtures/`, `src/page-objects/`, `src/tasks/`, `src/services/`, or `src/types/`."
---

# Shopware ATS

Use this skill to make precise ATS changes without over-abstracting. Keep this file directive; use `references/repo-map.md` for detailed layout and examples.

## Start Here

- Open `package.json`, `playwright.config.ts`, and `src/index.ts`.
- Then open `references/repo-map.md` for merge points and edit targets.

## Choose The Right Layer

Pick the narrowest owner of the behavior:

- `tests/`: spec flow, assertions, and coverage composition.
- `src/page-objects/`: selectors, URLs, and page-level affordances. Follow the local page-object pattern: initialize reusable locators as constructor-initialized `readonly` fields, and keep methods for parameterized locators only.
- `src/tasks/`: reusable multi-step business actions.
- `src/fixtures/`: context wiring, actors, lifecycle, and API/page contexts.
- `src/services/TestDataService.ts`: API-backed test data creation, setup, cleanup, and cleanup ordering (`highPriorityEntities`) for new work.
- `src/services/`: cross-cutting helpers and integrations.
- `src/types/`: shared fixture, page-object, task, and Shopware domain contracts.
- `src/locales/`: translation-backed assertion keys.

Treat `src/data-fixtures/` as a legacy compatibility surface. Do not introduce new data-fixtures when `TestDataService` can own the behavior; only touch legacy fixtures to keep existing public APIs working.

If you add a reusable primitive, export it through the appropriate merge file or `src/index.ts` so it stays reachable from the public API.

## When To Keep It Simple

Prefer a direct spec edit (no new abstraction) when all are true:

1. The behavior is used by one spec or one assertion path.
2. The interaction is short and readable inline.
3. Reuse is unlikely across other scenarios.

Only introduce or extend page objects, tasks, fixtures, services, or shared types when the same behavior is repeated, unstable, or clearly part of shared domain language.

## Keep Surfaces Separate

Keep each browser-driven scenario on one UI surface. Do not bounce between Administration and Storefront in the same task or spec just because both fixtures are available.

In practice, that means one browser actor per scenario: `ShopAdmin` for Administration coverage or `ShopCustomer` for Storefront coverage. Neutral setup fixtures such as `TestDataService`, `AdminApiContext`, `StoreApiContext`, `DefaultSalesChannel`, or mail helpers can support either side because they do not switch the browser surface.

If a storefront scenario needs admin-side prerequisites, create them through `TestDataService`, `AdminApiContext`, or setup fixtures and then stay in Storefront. If an admin scenario needs storefront-side state, prepare it through `TestDataService`, `StoreApiContext`, or separate setup coverage instead of switching the browser surface mid-flow.

If a requested behavior truly spans both surfaces, split it into setup plus validation or into separate specs. Do not model browser flows that go Administration -> Storefront -> Administration, or the reverse.

## Prefer Deterministic Setup

Follow ATS and Playwright isolation rules so tests stay parallel-safe and resilient on unknown shop states:

- Prefer `TestDataService` for common entity setup and cleanup.
- Extend `TestDataService` when the same creation logic, relation setup, or cleanup behavior would otherwise be duplicated across tests.
- Use `AdminApiContext` or `StoreApiContext` for setup and verification when the UI is not the behavior under test.
- Prefer fixture-provided contexts such as `DefaultSalesChannel` over mutating shared shop state.
- Create all data a scenario needs explicitly. Do not rely on existing categories, rules, flows, users, customers, or other ambient shop state.
- Do not assume default locale or currency values like `en_GB` or `EUR`; set up or fetch what the scenario needs.
- When possible, navigate directly to detail pages with entity IDs. If you must go through a listing, search with a unique name so the scenario targets one known entity.

## Implementation Workflow

1. Reproduce with the smallest affected spec/test block.
2. Search for existing nouns, flows, and `TestDataService` helpers with `rg` before creating new helpers.
3. Trace from spec -> actor/task -> page object -> fixture/service/type and fix the owning layer.
4. Keep established patterns (`mergeTests`, `test.extend`, locale-aware assertions, and the actor model where it improves readability). The actor pattern is optional; plain Playwright is still valid when it is clearer. For Storefront flows, prefer `ShopCustomer.fillsIn()` and `ShopCustomer.presses()` where existing tasks already use that keyboard-first pattern; do not generalize that rule to Administration flows.
5. Keep version or SaaS branching explicit when tied to `InstanceMeta`.
6. Re-export new reusable surfaces via the right merge file or `src/index.ts`.
7. Keep page objects structural: constructor-initialize fixed `readonly` locators, use methods only for parameterized locators, and move multi-step behavior into tasks, services, or helper classes.

## Keep Specs High-Signal

When writing or refactoring ATS specs:

- Assert only what materially proves the behavior. Avoid duplicate visibility/count/text checks that restate the same fact with more noise.
- Favor a few high-signal assertions over exhaustive UI restatement. The goal is confidence in behavior, not a transcript of the page.

### Don't

- Do not hide most `expect(...)` calls inside helpers, tasks, or page objects. Those layers should usually return locators, values, or perform actions; only extract an `expect...` helper when the assertion is a shared domain primitive.
- Do not repeat explicit timeouts when Playwright's configured defaults already express the intended wait. Add a custom timeout only when one wait is genuinely exceptional and the reason is clear from the scenario.
- Do not split tiny actions or single assertions into separate `test.step(...)` blocks.
- Do not combine `ShopAdmin` and `ShopCustomer` UI actions in one browser-driven task or spec. If both surfaces are involved, use API or fixture setup for prerequisites and keep the UI flow on one side.
- Do not assume a list, table, or API helper returns only one item. Use unique names or IDs so the scenario identifies the exact entity it created.
- Do not request unused fixtures. If the spec does not read from a fixture, remove it or refactor the setup.
- Do not depend on implicit configuration or pre-existing shop data.
- Do not change global settings unless the scenario explicitly owns that scope; prefer sales-channel-specific setup and isolated test data.
- Do not stack duplicate visibility, count, and text assertions that restate the same fact with more noise.
- Do not turn a spec into a transcript of the page. Keep assertions focused on the few signals that materially prove the behavior.

## Validate

Run the narrowest useful checks first:

- `npx playwright test tests/<spec>.spec.ts --project=chromium`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

For environment defaults and boot behavior, rely on `playwright.config.ts` and the reference file instead of hardcoding assumptions.
