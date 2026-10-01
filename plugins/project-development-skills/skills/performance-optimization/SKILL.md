---
name: performance-optimization
description: Measure and improve latency, resource use, queries, rendering, or build/test throughput. Use when performance is the primary problem; preserve correctness and compare equivalent workloads.
---

# Performance Optimization

Make a performance claim that survives scrutiny: a confirmed bottleneck, a change that addresses it, and a before/after comparison under the same conditions, with business behavior unchanged.

## Delegation

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Define the claim and its envelope

Establish what is slow, where, for whom, and compared to what, then capture a baseline before changing anything: timing, query count, payload, memory, CPU, bundle size, Web Vitals, a profile, or logs.

Results are comparable only inside a fixed benchmark envelope, so record it: workload and data size, starting state, warm or cold cache, account and permissions, command and flags, worker count, retries, resource limits, and concurrent activity on the host. For noisy measurements, repeat enough to report a representative value and its spread; the best run is not the result.

Infrastructure health is part of the measurement. A run with crashes, OOM kills, unexpected restarts, failed setup or cleanup, or orphan processes is rejected and noted, not averaged in.

An unexplained correctness failure comes first: isolate it before optimizing, because a faster wrong answer is not an improvement.

## Find the bottleneck

Attribute the time before choosing a fix. Separate backend, database, network, frontend rendering, asset loading, build tooling, and external dependencies; within a test or benchmark run, separate setup, exercise, and cleanup.

Measure the work a flow produces instead of inferring it from where the driver runs. A browser or test runner on the host can still drive memory, CPU, and database load inside services, and a few visible actions can amplify into many requests, statements, rows, jobs, and retries.

Use existing instrumentation, traces, query logs, and profilers, and read the rules that govern the measured path before changing its data flow. [performance-playbook.md](references/performance-playbook.md) has domain checks for databases, backends, frontends, assets, builds, tests, and caching.

## Fix the confirmed cause

Start with the smallest change that addresses the measured bottleneck, and reach for new dependencies, infrastructure, or architecture only when measurement shows the local fix is insufficient.

- A cache is a contract. Define its invalidation, freshness, and per-user or per-tenant boundaries before relying on it.
- A faster suite must still test the same thing. Keep authentication, authorization, realtime, and other behavior under test intact.
- When concurrency exposes a failure, reproduce and fix the focused case. Raising timeouts or retries hides races and failed requests.
- A tradeoff in correctness, freshness, accessibility, or UX that the user has not accepted is theirs to decide.

## Verify

Rerun the same measurement inside the same envelope and compare. Where the workflow mutates state, confirm service health, cleanup, state restoration, and process termination on success, failure, and handled interruption.

Complete required checks and reuse focused evidence that is still valid. Broaden measurements or tests when the claim or an unresolved regression risk needs it, within the agreed budget. Add a regression guard when it would catch the bottleneck returning.

## Report

Give the baseline and after measurements with the envelope, sample size, and any rejected runs; the bottleneck and the change; how the result was verified; and the tradeoffs, cache invalidation rules, and risks that remain.
