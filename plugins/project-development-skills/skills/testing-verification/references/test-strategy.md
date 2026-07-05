# Test Strategy

Use this reference when deciding what to test, where to test it, and how broad verification should be.

## Source Of Truth

Before writing tests, inspect:

- Project instructions: `AGENTS.md`, `CLAUDE.md`, or equivalent.
- Existing tests near the changed files.
- Test config and scripts: `package.json`, `composer.json`, `pyproject.toml`, `go.mod`, CI workflows, and framework configs.
- Business docs, API docs, schema docs, route files, migrations, fixtures, mocks, factories, and seeders.

Do not infer expected behavior from implementation alone when docs or tests define special business rules.

## Level Selection

Choose the lowest reliable level that proves the behavior:

| Situation | Preferred level |
|---|---|
| Pure function, formatter, parser, validator | Unit |
| Hook, composable, store, reducer, state transition | Unit or component |
| API contract, controller, service, repository, database rule | Integration |
| Form behavior, validation messages, loading/error UI | Component or browser |
| Navigation, auth, multi-step user workflow | E2E/browser |
| Visual layout, screenshot-driven UI task | Browser screenshot, preferably element-level |
| Bug fix with known reproduction | Regression test at the failing boundary |

Avoid writing only high-level E2E tests for logic that can be verified faster and more reliably at a lower level.

## Existing Tools First

- JavaScript/TypeScript: use the detected Jest, Vitest, Node test runner, Testing Library, Cypress, Playwright, or framework test runner.
- PHP/Laravel: use PHPUnit, Pest, Laravel feature tests, factories, seeders, and HTTP assertions.
- Python: use pytest or the project's existing unittest setup.
- Go: use the standard `testing` package and table tests when appropriate.
- Rails/Django/Spring/etc.: follow the framework's existing test structure.

Do not introduce a test framework to avoid learning the existing one.

## Useful Assertions

Prefer assertions on:

- Public behavior.
- API status, shape, and important fields.
- Rendered text, roles, labels, accessible names, state, and validation feedback.
- Database side effects when persistence is the contract.
- Background jobs, events, queues, or notifications only when they are part of the behavior.
- Edge cases documented in the project, not arbitrary edge cases unrelated to the feature.

Avoid assertions on:

- Private implementation details.
- Fragile snapshots without a clear reason.
- Timing that can flake.
- Exact CSS class lists unless the class is a stable semantic locator or part of the contract.

## No Existing Tests

When no tests exist:

- Propose the smallest useful setup.
- Prefer a smoke test or one regression test over a broad testing framework migration.
- If adding automation is too large, write manual verification steps with exact commands, URLs, states, and expected outcomes.

## Final Gate

Before reporting completion:

- Targeted checks passed, or the remaining failure is clearly unrelated and documented.
- Broader checks were run when practical.
- Manual verification is documented when automation is absent.
- Any skipped checks have a clear reason.
