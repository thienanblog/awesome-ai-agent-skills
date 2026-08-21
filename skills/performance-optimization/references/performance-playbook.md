# Performance Playbook

Use this reference to identify likely bottlenecks and choose low-risk improvements.

## Baseline Evidence

Capture at least one concrete signal:

- Request duration.
- Query count and slow queries.
- Payload size.
- Memory or CPU.
- Queue/job runtime.
- Build or test duration.
- Browser profile, render timing, Web Vitals, bundle size, image/font loading.
- User flow timing with consistent data and viewport.

Do not claim improvement without before/after evidence unless measurement is impossible; in that case, state the limitation.

## Benchmark Design And Noise Control

Define the benchmark envelope before measuring:

- Fixed scenario or test selection.
- Fixed starting data, snapshot, account, tenant, and permissions.
- Warm or cold cache state.
- Command, flags, worker count, retries, browser or runtime versions, and
  resource limits.
- Known concurrent workloads on the host and dependent services.

Change only the variable being evaluated when possible. If concurrency or a
resource limit is the optimization, record it as an intentional difference.

For noisy workloads, run multiple samples and report a median or another
representative statistic with the observed range. Do not discard slow runs
without a stated reason. Reject runs affected by crashes, OOM kills, service
restarts, failed setup or cleanup, external outages, or unrelated heavy work;
record why they were rejected.

When a benchmark mutates persistent state, restore the same starting state
between comparable runs. A database snapshot is one option, but use the
project's supported reset or fixture mechanism when it provides equivalent
isolation.

## Workload Amplification

A small number of visible user actions can trigger substantial service work.
Measure the work produced instead of inferring it from where the driver runs.
A browser on the host can still induce memory, CPU, cache, queue, and database
load inside containers or remote services.

Useful signals include:

- Browser navigation and API request count.
- Setup, fixture, authentication, exercise, and cleanup duration.
- Total database statements separated into available classes such as reads,
  inserts, updates, and deletes.
- Row growth in high-volume business, audit, notification, and fixture tables.
- Queue jobs, events, cache writes, projections, observers, and retry counts.

Query count and row count answer different questions. High statement count with
small row growth often points to N+1 reads, repeated permission checks, or
repeated read-model refreshes. High row growth can indicate fixture
amplification, audit fan-out, notifications, or missing cleanup. Global database
counters can include unrelated traffic, so isolate the environment or disclose
that limitation.

## Database

Check for:

- N+1 queries.
- Missing indexes on filters, joins, foreign keys, and sort columns.
- Large unpaginated result sets.
- Over-fetching columns or relationships.
- Repeated aggregate queries.
- Per-row permission or formatting work.
- Slow text search that should use a proper index/search service.

Prefer:

- Eager loading or joins where appropriate.
- Pagination, cursor pagination, or streaming.
- Field selection.
- Batching.
- Query scopes or repositories that preserve existing business constraints.
- Indexes backed by real query patterns.

Do not add indexes blindly; consider write cost and migration risk.

## Backend

Check for:

- Repeated serialization or transformation.
- Large synchronous file/image/PDF processing.
- Heavy work inside request-response paths.
- Unbounded recursion or memory-heavy arrays.
- External API calls inside loops.
- Cache missing, over-broad, or stale.

Prefer:

- Queues/background jobs for heavy work.
- Streaming for large files.
- Batching external calls.
- Cache with explicit key scope and invalidation.
- Smaller response shapes and lazy loading.

## Frontend

Check for:

- Excessive re-renders.
- Prop drilling that causes broad updates.
- Large lists without pagination or virtualization.
- Rendering raw large JSON.
- Recomputing derived data on every render.
- Blocking synchronous work in event handlers.
- Oversized bundles.
- Images without thumbnails, dimensions, lazy loading, or responsive sizes.
- Font loading that blocks rendering.

Prefer:

- Existing state-management patterns.
- Memoization only around expensive stable work.
- Data splitting and pagination.
- Virtualization for large lists.
- Lazy loading routes and heavy components.
- Optimized images, thumbnails, and `font-display: swap`.

## Build And Tests

Check for:

- Full builds run where targeted checks would work.
- Test setup repeated unnecessarily.
- Slow integration/E2E tests covering logic that could be lower-level.
- Dependency cache misses in CI.
- Generated files rebuilt too often.
- Authentication, permission, or catalog fixtures synchronized for every test
  file or worker.
- Shared mutable records, global counters, or persistent workspaces that make
  otherwise independent tests contend.
- Browser tests that accidentally exercise realtime or background integrations
  unrelated to the assertion.
- Test records, logs, notifications, or cache entries that accumulate across
  comparable runs.

Prefer:

- Targeted commands during development.
- After implementation and targeted checks are complete, offering broader checks
  for the user's approval before running them.
- CI caching that matches lock files.
- Separating smoke, unit, integration, and E2E suites when the project supports it.
- Batching deterministic fixture setup and reusing validated sessions or tokens
  with freshness and permission revalidation.
- Keeping real login, authorization, realtime, and integration coverage in
  dedicated tests when routine tests use a safe optimized fixture.
- Isolating shared-state scenarios into a serial or exclusive lane while
  parallelizing independent tests.

### E2E Concurrency

Treat worker count as a measured parameter, not an unconditional speed switch:

1. Establish a stable low-concurrency baseline.
2. Increase workers one step at a time.
3. Measure throughput, tail duration, service CPU and memory, database pressure,
   retries, and flakes at each step.
4. Stop increasing workers when throughput stops improving or contention and
   instability grow materially.

Keep the tested behavior intact. Session reuse should revalidate identity and
authorization and provide an opt-out for authentication-specific coverage.
Mock or disable an integration only when it is outside the scenario, and retain
dedicated coverage for the real integration path.

When higher concurrency exposes a failure, run that scenario alone and in the
smallest reproducing concurrent group. Distinguish:

- A real application race or stale-response bug.
- Shared fixture or global-state contention.
- A selector or readiness assertion that observes the wrong condition.
- Resource starvation or an infrastructure restart.
- A genuinely insufficient timeout after the expected state was proven.

Fix the focused failure and rerun the smallest reproducing check. After the fix
and focused verification are complete, ask the user whether to rerun the full
suite. Prefer semantic readiness assertions and bounded overall test time.
Raising timeouts or enabling retries without identifying the cause can hide
incorrect state and invalidate the benchmark.

### Stateful Runner Guardrails

For suites that mutate a development database or temporarily change service
resources, prefer a protected runner that can:

- Refuse unsafe targets such as production endpoints.
- Detect another conflicting test runner when shared state is involved.
- Check service health and available resource headroom before starting.
- Capture the starting state and restore it after success or failure.
- Restore temporary resource-limit changes.
- Forward handled termination signals and remove child processes, locks, and
  temporary artifacts.
- Fail the run when a service unexpectedly restarts, is OOM-killed, or cannot be
  restored, even if individual test assertions passed.

Exercise cleanup paths deliberately. A cleanup design that is verified only on
successful runs is incomplete.

## Caching Rules

Before adding or changing cache:

- Define cache key scope: user, tenant, locale, permissions, filters, version.
- Define invalidation or TTL.
- Confirm stale data is acceptable.
- Avoid caching secrets or sensitive user-specific data under shared keys.
- Document the rule if future maintainers could break it.

## Verification

Use the same scenario before and after:

- Same environment.
- Same data size.
- Same account/tenant/permissions.
- Same viewport for UI measurements.
- Same command and flags for build/test timing.

Also verify:

- Same starting snapshot or fixture state for stateful measurements.
- Expected service health and restart counts.
- No orphan runner, browser, worker, lock, or temporary snapshot remains.
- Persistent data and temporary resource limits were restored.
- Focused regression tests pass. After the work is complete, ask the user whether
  to rerun the full suite.

Report both the metric and the practical user impact. Include sample count,
representative value and spread when repeated, intentional benchmark-envelope
differences, rejected runs, and any measurement that could not be retained.
