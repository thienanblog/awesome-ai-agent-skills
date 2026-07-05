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

Prefer:

- Targeted commands during development.
- Broader checks before handoff.
- CI caching that matches lock files.
- Separating smoke, unit, integration, and E2E suites when the project supports it.

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

Report both the metric and the practical user impact.
