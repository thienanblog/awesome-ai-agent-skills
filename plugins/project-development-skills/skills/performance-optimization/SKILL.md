---
name: performance-optimization
description: Diagnose and improve performance with measurements and source-of-truth constraints. Use when the user reports slowness, latency, high CPU, high memory, slow queries, N+1 issues, large payloads, slow builds, slow tests, rendering lag, bundle size, Core Web Vitals, caching, pagination, image/font loading, queues, background jobs, or asks to profile, optimize, speed up, or reduce resource usage.
---

# Performance Optimization

Use this skill when performance is the main concern. Measure first, optimize the confirmed bottleneck, and verify improvement without changing business behavior accidentally.

## Operating Rules

- Do not optimize blindly. Capture a baseline or concrete symptom first.
- Read project docs, architecture notes, caching rules, database rules, design-system rules, and existing performance conventions.
- Preserve business logic and data correctness.
- Prefer low-risk local improvements before broad architecture changes.
- Treat caching as a contract: define invalidation, freshness, and user-specific data boundaries.
- Avoid adding dependencies or infrastructure unless measurement justifies them.
- If the issue is actually a bug or regression with unclear cause, switch to `debugging-workflow`.
- If the issue requires benchmarks, regression tests, or browser visual checks, coordinate with `testing-verification`.

## Workflow

### 1. Define The Performance Claim

- Identify what is slow, where, for whom, and compared to what.
- Capture baseline evidence: timing, query count, payload size, memory, CPU, bundle size, Web Vitals, screenshot, profile, or logs.
- Identify the environment and data size used for measurement.

### 2. Find The Bottleneck

- Separate backend latency, database time, network payload, frontend rendering, asset loading, build tooling, and external dependency time.
- Check source-of-truth docs for expected behavior before changing data flow.
- Inspect existing instrumentation, logs, traces, query debug output, profiler data, and browser performance tools when available.

Read `references/performance-playbook.md` for domain-specific checks.

### 3. Choose The Smallest Useful Fix

- Database: indexes, eager loading, joins, batching, pagination, field selection, avoiding N+1.
- Backend: reduce redundant work, stream or queue heavy work, avoid large in-memory operations, cache carefully.
- Frontend: reduce unnecessary renders, split data, virtualize large lists, lazy load, memoize where useful, optimize images/fonts.
- Build/tests: cache dependencies, reduce repeated setup, isolate slow suites, avoid unnecessary full rebuilds.

### 4. Verify Improvement

- Rerun the same measurement.
- Compare before/after using the same data and environment when possible.
- Add regression coverage or guardrails when practical.
- If performance improved by trading off freshness, correctness, accessibility, or UX, document and confirm that tradeoff.

## Reporting

Report:

- Baseline and after measurement.
- Bottleneck identified.
- Change made.
- Verification command, profiler, screenshot, or metric.
- Tradeoffs, cache invalidation rules, and remaining risks.

## References

- `references/performance-playbook.md`: database, backend, frontend, asset, build, test, and caching performance checks.
