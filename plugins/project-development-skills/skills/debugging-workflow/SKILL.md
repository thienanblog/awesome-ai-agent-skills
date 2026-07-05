---
name: debugging-workflow
description: Reproduce, isolate, and fix software bugs without guessing. Use when the user reports errors, stack traces, crashes, regressions, logs, broken behavior with unknown cause, flaky behavior, incorrect business logic, UI bugs, integration failures, failing tests or CI failures with unclear root cause, or asks to debug, investigate, diagnose, or find the root cause of a problem.
---

# Debugging Workflow

Use this skill when the task starts from a failure or unexplained behavior. Preserve business intent, isolate the smallest failing case, and fix the confirmed cause.

## Operating Rules

- Reproduce before fixing when possible.
- Read logs, stack traces, test output, screenshots, and source-of-truth docs before changing code.
- Do not replace unusual business logic with a generic solution.
- Do not make broad refactors while the failure cause is still unknown.
- Form one hypothesis at a time and test it with the fastest reliable check.
- Keep temporary debug code local and remove it before completion.
- Add or update a regression test when practical.
- If the root cause is performance-related, switch to `performance-optimization`.
- If the main work becomes test strategy, switch to `testing-verification`.

## Workflow

### 1. Capture The Failure

- Record the exact command, URL, input, account state, branch, environment, and error output.
- Preserve stack traces and failing assertions.
- For UI bugs, capture the target element/region screenshot first, then full page only if needed.
- For user screenshots that are ambiguous, annotate unclear regions with labels and ask before coding.

### 2. Read Source Of Truth

- Read `AGENTS.md`, `CLAUDE.md`, relevant docs, feature specs, design-system docs, route/API/schema files, and nearby tests.
- Identify whether current behavior is wrong or the expectation is unclear.
- If docs and code disagree, call out the conflict instead of silently choosing one.

### 3. Reproduce And Minimize

- Run the smallest command or flow that exposes the failure.
- Reduce the input, state, fixture, route, component, or test to the smallest failing case.
- Keep reproduction steps repeatable.

### 4. Isolate

- Trace the failure from symptom to boundary: UI event, API request, controller, service, database, queue, cache, external dependency, build step, or deployment config.
- Inspect recent changes only as a clue, not proof.
- Use logs, debugger output, targeted prints, breakpoints, or temporary instrumentation carefully.
- Use Binary Debug only when normal reproduction and fast checks do not isolate the cause.

Read `references/debugging-playbook.md` for deeper isolation patterns.

### 5. Fix The Confirmed Cause

- Make the smallest change that fixes the confirmed cause.
- Preserve public APIs and documented behavior unless changing them is the task.
- Keep unrelated cleanup separate.
- Remove temporary debug code.

### 6. Prove And Document

- Rerun the failing check first.
- Run related targeted tests.
- Run broader checks when practical.
- Add or update a regression test when possible.
- Document difficult bugs in feature docs or project memory when the project would benefit.

## Reporting

Report:

- Reproduction steps or why reproduction was not possible.
- Root cause.
- Files changed.
- Tests/checks/screenshots run.
- Any remaining uncertainty or skipped verification.

## References

- `references/debugging-playbook.md`: reproduction, isolation, Binary Debug, logs, UI bugs, backend bugs, and flaky failures.
