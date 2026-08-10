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
- Test behavior and contracts, not implementation details, unless the project already expects lower-level tests.
- Do not add a new testing framework unless the project has no reasonable existing path and the benefit is clear.
- Keep tests maintainable: small setup, clear assertions, stable fixtures, no hidden network or production dependencies.

## Workflow

### 1. Discover Test Sources

- Identify test commands, CI jobs, browser tooling, fixtures, helpers, and source-of-truth behavior docs.
- Read nearby tests for structure, setup, cleanup, and assertion style.

### 2. Choose Verification Level

- Unit: pure logic, validation, formatting, reducers, helpers, composables, hooks.
- Integration: service boundaries, repositories, controllers, API contracts, database behavior.
- Component: rendered states, props/events, accessibility expectations.
- Browser pass: user-visible states, exploratory interaction, dashboards, visual layout, screenshots.
- E2E: repeatable routing, forms, authentication, multi-step workflows, CI regressions.
- Manual verification: acceptable only when automation is unavailable or disproportionate; document exact steps.

Read `references/test-strategy.md` when deciding what level to use.

### 3. Implement Tests Or Checks

- Reuse existing helpers and fixtures before creating new ones.
- Keep each test focused on one coherent behavior or scenario.
- Include edge cases that are business-relevant, not exhaustive noise.
- For bug fixes, add a regression test that fails before the fix when practical.
- For docs-only changes, verify links, examples, generated outputs, or commands when relevant.

### 4. Verify UI In A Browser

- For interactive, exploratory, screenshot, or visual-comparison work, use the harness's built-in Browser when available and follow its instructions.
- Use Playwright MCP only when built-in Browser is unavailable, and record why. If the user explicitly selected Browser, report the blocker and ask before substituting another surface.
- Keep source-controlled Playwright E2E distinct: it provides repeatable regression and CI coverage and may complement, not replace, an interactive Browser pass.
- Read `references/ui-visual-verification.md` for screenshot scope, before/after comparison, viewport consistency, and ambiguous-image handling.

### 5. Run And Iterate

- Run the smallest useful command first.
- Fix failures and rerun the failing target.
- Run broader tests when practical after targeted checks pass.
- If a failure is unclear, switch to `debugging-workflow`.
- If the task is slow performance validation, switch to `performance-optimization`.

## Reporting

Report:

- Test or verification strategy used.
- Commands run and results.
- UI verification surface used: built-in Browser, Playwright MCP fallback, Playwright E2E, or a combination.
- Screenshots or visual artifacts captured when relevant.
- Coverage gaps or checks that could not be run.
- Residual risk and the next highest-value test if any.
