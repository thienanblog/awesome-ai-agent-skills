---
name: performance-optimization
description: Measure and improve latency, resource use, queries, rendering, or build/test throughput. Use when performance is the primary problem; preserve correctness and compare equivalent workloads.
---

# Performance Optimization

Use this skill when performance is the main concern. Measure first, optimize the confirmed bottleneck, and verify improvement without changing business behavior accidentally.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Operating Rules

- Do not optimize blindly. Capture a baseline or concrete symptom first.
- Define a benchmark envelope before comparing results: workload, starting data,
  cache state, command and flags, resource limits, and concurrent activity.
- Read the rules and instrumentation relevant to the measured path.
- Preserve business logic and data correctness.
- Prefer low-risk local improvements before broad architecture changes.
- Treat caching as a contract: define invalidation, freshness, and user-specific data boundaries.
- Treat infrastructure health as part of correctness. Reject measurements with
  crashes, OOM kills, unexpected restarts, failed cleanup, or orphan processes.
- Avoid adding dependencies or infrastructure unless measurement justifies them.
- For an unexplained correctness failure, isolate it before optimizing. Consult debugging or testing guidance only when it adds useful depth to the work.

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
- Keep improvements within the agreed correctness, freshness, accessibility, and UX requirements. Obtain a decision for a material tradeoff not already accepted.
- Complete required checks and reuse valid focused evidence. Broaden measurements or tests only when the performance claim or an unresolved regression risk needs them, within the agreed budget.

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
