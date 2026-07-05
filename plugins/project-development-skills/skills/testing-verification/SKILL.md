---
name: testing-verification
description: Plan, add, repair, and run tests and verification for software changes. Use when the user asks for tests, coverage, QA, acceptance criteria, regression checks, CI test failures, Playwright or browser verification, UI screenshot comparison, visual regression, or when a code change needs a focused test strategy across frontend, backend, API, or full-stack workflows.
---

# Testing Verification

Use this skill when testing or verification is a meaningful part of the task. Prefer project evidence over generic test advice, and verify behavior at the narrowest reliable level before broadening.

## Operating Rules

- Read project instructions, docs, existing test conventions, package scripts, CI config, and nearby tests before adding or changing tests.
- Use the project's existing test tools and naming conventions.
- Test behavior and contracts, not implementation details, unless the project already expects lower-level tests.
- Prefer targeted verification first, then broader suites when practical.
- Do not add a new testing framework unless the project has no reasonable existing path and the benefit is clear.
- Keep tests maintainable: small setup, clear assertions, stable fixtures, no hidden network or production dependencies.
- For UI work, prefer real-browser verification and element-level screenshots before full-page screenshots.
- When user-provided UI images are ambiguous, annotate unclear areas with labeled circles/arrows and ask before coding.

## Workflow

### 1. Discover Test Sources

- Identify test commands, CI jobs, fixtures, mocks, factories, seeders, test helpers, and browser tooling.
- Read nearby tests for naming, structure, setup, cleanup, and assertion style.
- Identify source-of-truth docs for expected behavior.

### 2. Choose Verification Level

- Unit: pure logic, validation, formatting, reducers, helpers, composables, hooks.
- Integration: service boundaries, repositories, controllers, API contracts, database behavior.
- Component: rendered states, props/events, accessibility expectations.
- E2E/browser: user-visible flows, routing, forms, authentication, dashboards, visual layout.
- Manual verification: acceptable only when automation is unavailable or disproportionate; document exact steps.

Read `references/test-strategy.md` when deciding what level to use.

### 3. Implement Tests Or Checks

- Reuse existing helpers and fixtures before creating new ones.
- Keep one test focused on one behavior.
- Include edge cases that are business-relevant, not exhaustive noise.
- For bug fixes, add a regression test that fails before the fix when practical.
- For docs-only changes, verify links, examples, generated outputs, or commands when relevant.

### 4. Verify UI Visually

- Use Playwright MCP, Playwright, Chrome DevTools MCP, or equivalent browser automation when available.
- Capture the specific element or region being changed before a full page.
- Use full-page screenshots only when page-level composition, scrolling, or surrounding context matters.
- Capture before and after screenshots when visual output is material.
- Compare the same viewport and state unless you state why they differ.

Read `references/ui-visual-verification.md` for screenshot and image-clarification rules.

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
- Screenshots or visual artifacts captured when relevant.
- Coverage gaps or checks that could not be run.
- Residual risk and the next highest-value test if any.

## References

- `references/test-strategy.md`: choose test level, scope, and assertions.
- `references/ui-visual-verification.md`: element-first screenshots, before/after comparison, and annotated image clarification.
