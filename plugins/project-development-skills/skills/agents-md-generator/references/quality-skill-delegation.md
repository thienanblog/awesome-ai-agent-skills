# Quality Skill Delegation

Use this reference when generating quality gates for `AGENTS.md` or `CLAUDE.md`.

This skill should capture project-specific commands and conventions, not deep quality workflows.

When available, reference specialized skills in generated project instructions:

- `testing-verification`: test strategy, QA, CI checks, browser verification, UI screenshots, and acceptance criteria.
- `debugging-workflow`: reproduction, logs, failing tests with unclear root cause, stack traces, regressions, flaky behavior, and root-cause isolation.
- `performance-optimization`: slow queries, latency, memory/CPU, rendering lag, bundle size, caching, payloads, builds, and test speed.

Include a concise generated section like:

```markdown
## Quality Gates
- Use existing test, lint, type-check, build, and browser verification commands before adding new tooling.
- For UI changes, capture the target element/region before full-page screenshots; use before/after screenshots when visual output changes.
- For bugs, reproduce first, read logs, isolate the smallest failing case, and add a regression test when practical.
- For routine test additions or CI test verification, use the project test strategy rather than debugging flow.
- For performance work, measure a baseline before optimizing and document cache invalidation or tradeoffs.
```

If the specialized skills are not available, generate only the concise rules above and point to project docs where they exist.
