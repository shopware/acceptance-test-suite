---
name: shopware-ats
description: "Work effectively in the Shopware Acceptance Test Suite repository: inspect or modify Playwright specs, merged fixtures, page objects, tasks, data fixtures, service helpers, and locale-backed assertions. Use when Codex needs to debug a failing ATS test, add or refactor Shopware end-to-end coverage, trace how exported fixtures are wired together, or choose the right file to update in `tests/`, `src/fixtures/`, `src/page-objects/`, `src/tasks/`, `src/data-fixtures/`, or `src/services/`."
---

# Shopware ATS

Use this skill to make precise ATS changes without over-abstracting. Keep this file directive; use `references/repo-map.md` for detailed layout and examples.

## Start Here

- Open `package.json`, `playwright.config.ts`, and `src/index.ts`.
- Then open `references/repo-map.md` for merge points and edit targets.

## Choose The Right Layer

Pick the narrowest owner of the behavior:

- `tests/`: spec flow, assertions, and coverage composition.
- `src/page-objects/`: selectors, URLs, and page-level affordances.
- `src/tasks/`: reusable multi-step business actions.
- `src/data-fixtures/` or `src/services/TestDataService.ts`: generated test data and cleanup.
- `src/fixtures/`: context wiring, actors, lifecycle, and API/page contexts.
- `src/services/`: cross-cutting helpers and integrations.
- `src/locales/`: translation-backed assertion keys.

If you add a reusable primitive, export it through the appropriate merge file so it is reachable from `src/index.ts`.

## When To Keep It Simple

Prefer a direct spec edit (no new abstraction) when all are true:

1. The behavior is used by one spec or one assertion path.
2. The interaction is short and readable inline.
3. Reuse is unlikely across other scenarios.

Only introduce or extend page objects/tasks/fixtures when the same behavior is repeated, unstable, or clearly part of shared domain language.

## Implementation Workflow

1. Reproduce with the smallest affected spec/test block.
2. Search for existing nouns/flows with `rg` before creating new helpers.
3. Trace from spec -> actor/task -> page object -> fixture/service and fix the owning layer.
4. Keep established patterns (`mergeTests`, `test.extend`, actor model, locale-aware assertions).
5. Keep version or SaaS branching explicit when tied to `InstanceMeta`.
6. Re-export new reusable surfaces via the right merge file.

## Validate

Run the narrowest useful checks first:

- `npx playwright test tests/<spec>.spec.ts --project=chromium`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

For environment defaults and boot behavior, rely on `playwright.config.ts` and the reference file instead of hardcoding assumptions.
