# Debugging Playbook

Use this reference when a failure is not obvious after reading the error and nearby code.

## Failure Capture Checklist

Capture:

- Exact command, URL, input, or user flow.
- Full error output and stack trace.
- Environment: local/container/CI/production-like, branch, relevant env flags.
- Recent migration/build/cache/dependency changes.
- Screenshots for UI bugs, focused on the element or region first.
- Expected behavior source: docs, tests, issue, screenshot, product rule, or user clarification.

## Isolation Map

Trace the symptom to one boundary:

- UI: event handler, state update, component props, router, store, API call, CSS/layout, animation.
- API/backend: route, middleware, request validation, controller, service, repository/model, serializer/resource, database, queue/event.
- Data: migration, seed, fixture, factory, cache, permissions, tenant scope, timezone, locale.
- Build/tooling: config, module resolution, env var, package version, generated files.
- External: API response, webhook payload, network failure, rate limit, auth token, service outage.

## Hypothesis Loop

Use this loop:

1. State the current hypothesis.
2. Choose the fastest check that can disprove it.
3. Run the check.
4. Keep, refine, or discard the hypothesis.
5. Move one boundary deeper only when evidence points there.

Do not stack multiple unverified fixes.

## Binary Debug

Use Binary Debug when normal tracing is inconclusive:

- Create a clean temporary baseline that still loads and runs.
- Comment, stub, feature-flag, or bypass safe boundaries instead of deleting code.
- Re-enable one logical section at a time.
- Run the fastest failing check after each section.
- When a section fails, disable it again to confirm it is a candidate.
- Continue checking unrelated sections to find additional candidates.
- Fix confirmed sources one at a time.
- Restore disabled code and remove temporary debug artifacts before completion.

Do not use Binary Debug on production systems or destructive migrations.

## Logs And Instrumentation

- Prefer existing logs and observability first.
- Add temporary logs only when they answer a specific question.
- Do not log secrets, tokens, passwords, private keys, payment data, or sensitive personal data.
- Remove noisy temporary logs after the fix.
- If a useful log should remain, make it structured, low-volume, and safe.

## Flaky Failures

Check for:

- Time, timezone, locale, random order, race conditions, async waits, debounce/throttle, network dependency, shared database state, cache, and parallel test pollution.
- Test assertions that depend on implementation timing instead of observable behavior.
- Missing cleanup in tests.

Fix flakes by making the condition deterministic, not by increasing sleeps unless the framework requires a bounded wait.

## Final Proof

Before handoff:

- Original failure no longer reproduces.
- Targeted regression check passes.
- Related behavior still works.
- Any unverified assumptions are explicit.
