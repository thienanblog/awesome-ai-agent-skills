---
name: performance-optimization
description: Coordinator-routed specialist for measured latency, CPU, memory, query, payload, rendering, bundle, caching, or build/test bottlenecks. Use after project-development-mindset establishes performance as the primary work, or directly when explicitly invoked or installed standalone. Use debugging first for unexplained failures; do not use for routine performance-aware implementation.
---

# Performance Optimization

Use this skill when performance is the main concern. Measure first, optimize the confirmed bottleneck, and verify improvement without changing business behavior accidentally.

Run this skill in the main conversation. Do not spawn subagents, agent teams, or
delegated parallel workers unless the user explicitly approves the proposed
count and scope after being told that doing so can increase usage. Ask again
before expanding an approved scope.

## Operating Rules

- Do not optimize blindly. Capture a baseline or concrete symptom first.
- Define a benchmark envelope before comparing results: workload, starting data,
  cache state, command and flags, resource limits, and concurrent activity.
- Read project docs, architecture notes, caching rules, database rules, design-system rules, and existing performance conventions.
- Preserve business logic and data correctness.
- Prefer low-risk local improvements before broad architecture changes.
- Treat caching as a contract: define invalidation, freshness, and user-specific data boundaries.
- Treat infrastructure health as part of correctness. Reject measurements with
  crashes, OOM kills, unexpected restarts, failed cleanup, or orphan processes.
- Avoid adding dependencies or infrastructure unless measurement justifies them.
- If the issue is actually a bug or regression with unclear cause, return
  routing control to `project-development-mindset` and replace this workflow
  with `debugging-workflow` when available.
- Keep benchmarks, regression checks, and browser measurements inside this
  workflow when they support performance work. Route to `testing-verification`
  only if test or QA design becomes the primary deliverable.

## Workflow

### 1. Define The Performance Claim

- Identify what is slow, where, for whom, and compared to what.
- Capture baseline evidence: timing, query count, payload size, memory, CPU, bundle size, Web Vitals, screenshot, profile, or logs.
- Identify the environment and data size used for measurement.
- Fix the workload and starting state. Record warm or cold cache, account and
  permissions, worker count, retries, resource limits, and unrelated workloads.
- For noisy measurements, run enough repetitions to report a representative
  value and spread instead of selecting the best run.

### 2. Find The Bottleneck

- Separate backend latency, database time, network payload, frontend rendering, asset loading, build tooling, and external dependency time.
- Separate setup, exercise, and cleanup costs. A browser or test runner on the
  host can still drive memory, CPU, and database work inside services.
- Measure workload amplification where relevant: request volume, statement
  classes, row growth, repeated fixture work, background jobs, and retries.
- Check source-of-truth docs for expected behavior before changing data flow.
- Inspect existing instrumentation, logs, traces, query debug output, profiler data, and browser performance tools when available.

Read `references/performance-playbook.md` for domain-specific checks.

### 3. Choose The Smallest Useful Fix

- Database: indexes, eager loading, joins, batching, pagination, field selection, avoiding N+1.
- Backend: reduce redundant work, stream or queue heavy work, avoid large in-memory operations, cache carefully.
- Frontend: reduce unnecessary renders, split data, virtualize large lists, lazy load, memoize where useful, optimize images/fonts.
- Build/tests: cache dependencies, batch or reuse validated setup, isolate
  shared-state tests, sweep concurrency gradually, and avoid unnecessary full
  rebuilds. Do not weaken authentication, authorization, realtime, or other
  behavior under test merely to make a suite faster.

### 4. Verify Improvement

- Rerun the same measurement.
- Compare before/after using the same data and environment when possible.
- When concurrency exposes a failure, reproduce and fix the focused case before
  rerunning the full benchmark. Do not hide races or failed requests by only
  increasing timeouts or retries.
- Verify service health, cleanup, state restoration, and process termination on
  success, failure, and handled interruption where the workflow mutates state.
- Add regression coverage or guardrails when practical.
- If performance improved by trading off freshness, correctness, accessibility, or UX, document and confirm that tradeoff.

## Reporting

Report:

- Baseline and after measurement.
- Benchmark envelope, repetitions or sample size, and any rejected runs.
- Bottleneck identified.
- Change made.
- Verification command, profiler, screenshot, or metric.
- Tradeoffs, cache invalidation rules, and remaining risks.

## References

- `references/performance-playbook.md`: database, backend, frontend, asset, build, test, and caching performance checks.
