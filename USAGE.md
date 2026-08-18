# Shopware ATS — user guide

**Audience:** QA engineers, contributors, and anyone driving Codex (or similar assistants) on this repo.  
**Not loaded automatically by the skill:** the assistant uses `.codex/skills/shopware-ats/SKILL.md` for behavior rules; this file at the repository root is only for **you** — how to invoke the skill and what context to include.

## Structure

```text
.
  USAGE.md                              # This file: how humans should use the shopware-ats skill
.codex/skills/shopware-ats/             # Source of truth
  SKILL.md                              # Loaded by Codex/Claude: behavioral rules for the assistant
  agents/openai.yaml                    # Codex-only: agent display name / default prompt metadata
  references/repo-map.md                # Detailed repository layout and change paths
.claude/
  skills/shopware-ats/                  # Mirrors only SKILL.md + references/ (symlinks) — no agents/
  agents/shopware-ats.md                # Claude-only: equivalent of agents/openai.yaml
```

## Purpose

Use this guide to:

- invoke `shopware-ats` intentionally in Codex
- attach the right ATS context up front
- avoid mixing human-facing usage notes with assistant behavior rules

For layer selection, implementation workflow, validation, guardrails, and repository-specific behavior, rely on `.codex/skills/shopware-ats/SKILL.md`.

## How To Trigger It In Codex

Mention the skill by name in the request so Codex loads it intentionally.

Example prompts:

- `Use the shopware-ats skill to debug tests/PageObjects/AdministrationCustomer.spec.ts.`
- `Use the shopware-ats skill to add storefront coverage for account registration.`
- `Use the shopware-ats skill to refactor this ATS setup in tests/example.spec.ts.`
- `Use the shopware-ats skill to review this planned ATS change before editing.`

## What Context To Include

Include as much of the following as you know:

- the affected files or paths
- the user-visible behavior that is broken or missing
- the relevant scope or area of the suite
- the intended outcome: bugfix, refactor, review, or new coverage
- any relevant constraints from the task or environment

## Before You Send The Request

If you already know the likely touch points, include them directly in the prompt:

- file paths
- failing behavior, missing coverage, or refactor goal
- any constraints that affect the request

## Recommended Prompt Shapes

Use one of these patterns when asking Codex for help:

- `Use the shopware-ats skill to debug <file>.`
- `Use the shopware-ats skill to add coverage for <behavior>.`
- `Use the shopware-ats skill to refactor <file or flow>.`
- `Use the shopware-ats skill to review this ATS change before I edit it.`
