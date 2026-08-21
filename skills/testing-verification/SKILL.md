---
name: testing-verification
description: Plan, add, repair, and run tests and verification for software changes. Use for test strategy, coverage, QA, acceptance criteria, regressions, CI failures, browser verification, Playwright E2E, visual comparison, or focused frontend, backend, API, and full-stack checks.
---

# Testing Verification

Prefer project evidence over generic test advice, and verify behavior at the narrowest reliable level before broadening.

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
count and scope after being told that doing so can increase usage. Ask again
before expanding an approved scope.

## Operating Rules

- Follow project instructions, existing test tools, naming conventions, and nearby tests.
- Test public behavior and contracts at the narrowest reliable level; avoid implementation details unless the project expects them.
- Do not add a new testing framework unless the project has no reasonable existing path and the benefit is clear.
- Keep tests maintainable: small setup, clear assertions, stable fixtures, no hidden network or production dependencies.

## Workflow

### 1. Discover And Scope

- Identify test commands, CI jobs, nearby tests, browser tooling, fixtures, helpers, and source-of-truth behavior docs.
- Read `references/test-strategy.md`, choose the lowest reliable level, and prioritize targeted checks before broader suites.
- Use documented manual steps only when automation is unavailable or disproportionate.

### 2. Add Tests Or Checks

- Reuse existing helpers and fixtures; keep each test focused on one coherent behavior or scenario.
- Include edge cases that are business-relevant, not exhaustive noise.
- For bug fixes, add a regression test that fails before the fix when practical.
- For docs-only changes, verify links, examples, generated outputs, or commands when relevant.

### 3. Verify UI In A Browser

- For interactive, exploratory, screenshot, or visual-comparison work, use the harness's built-in Browser when available and follow its instructions.
- Use Playwright MCP only when built-in Browser is unavailable, and record why. If the user explicitly selected Browser, report the blocker and ask before substituting another surface.
- Keep source-controlled Playwright E2E distinct: it provides repeatable regression and CI coverage and may complement, not replace, an interactive Browser pass.
- Read `references/ui-visual-verification.md` for screenshot scope, before/after comparison, viewport consistency, and ambiguous-image handling.

### 4. Run And Report

- Run the smallest useful target and rerun focused failures. Keep automatic
  verification scoped to the affected behavior. After the requested work and
  focused checks are complete, list any broader or full-suite options and ask
  the user whether to run them; do not run them without explicit approval unless
  higher-priority repository instructions require them.
- Use `debugging-workflow` for unclear failures and `performance-optimization` for performance validation.
- Report the strategy, exact commands and results, UI verification surface, screenshots, gaps, residual risk, and next highest-value test.
