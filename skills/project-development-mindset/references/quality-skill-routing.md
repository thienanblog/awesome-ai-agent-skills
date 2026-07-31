# Quality Skill Routing

Use this reference from `project-development-mindset` when a task might need a specialized quality skill.

## Stay In Project Development Mindset

Stay in the general workflow when:

- The task is a normal feature, refactor, docs update, setup change, or small bug fix.
- Testing, debugging, or performance is only a small verification step.
- The main risk is understanding project source of truth, reuse, file boundaries, or documentation alignment.

## Switch To `run-reviewable-subtask-loop`

Use `run-reviewable-subtask-loop` when the task centers on:

- Executing a large plan, architecture migration, refactor, or feature roadmap
  as multiple dependent slices.
- Choosing coherent subtask boundaries that are substantial enough to code,
  review, and test meaningfully without mixing unrelated responsibilities.
- Creating atomic locally reviewed commits and last-known-good integration
  checkpoints.
- Recovering by rebuilding an invalid slice and its dependent suffix.
- Budgeting local slice, phase, and final verification while reserving remote CI
  for the aggregate review request.
- Resuming a partially completed multi-slice delivery from branches, commits,
  and repository records.

Stay in `project-development-mindset` for a normal task whose review and recovery
value does not justify multiple checkpoints.

## Switch To `testing-verification`

Use `testing-verification` when the task centers on:

- Adding, repairing, or expanding tests.
- Choosing test strategy or coverage.
- Verifying acceptance criteria.
- Running or interpreting test suites.
- Browser verification, Playwright screenshots, visual regression, or UI before/after checks.
- CI failures where the failure is already clearly a test or verification problem.

If the test is failing for an unknown reason, use `debugging-workflow` first.

## Switch To `debugging-workflow`

Use `debugging-workflow` when the task starts from:

- Error messages, stack traces, failing commands, broken UI, incorrect data, crashes, regressions, or logs.
- Flaky tests or behavior that cannot be explained yet.
- A request to debug, diagnose, investigate, find root cause, or fix a bug.

If the isolated cause is slow queries, memory, CPU, rendering, build time, or resource usage, switch to `performance-optimization`.

## Switch To `performance-optimization`

Use `performance-optimization` when the task centers on:

- Slow pages, slow APIs, slow queries, N+1 queries, high memory, high CPU, large payloads, render lag, bundle size, Core Web Vitals, caching, queues, background jobs, slow builds, or slow tests.
- Profiling, benchmarking, optimization, pagination, virtualization, lazy loading, image/font optimization, or cache design.

If the performance symptom cannot be reproduced or the cause is unknown, start with `debugging-workflow` and switch after the bottleneck is identified.

## Switch To `ui-ux-concept-implementation`

Use `ui-ux-concept-implementation` when the task centers on:

- generating and selecting UI/UX concepts before implementation
- implementing a selected concept, screenshot, mockup, or visual reference
- emulating or cloning a reference website's look and interaction pattern
- saving the selected concept outside commits
- verifying before/current/after UI states with Playwright MCP, Chrome DevTools MCP, Playwright, or screenshots

Use `testing-verification` too when screenshot comparison, acceptance criteria, or broader browser QA becomes the main verification risk.

## Combined Tasks

For broad tasks:

1. Use `project-development-mindset` to establish source of truth, reuse, and file boundaries.
2. Use `run-reviewable-subtask-loop` to coordinate delivery when the work needs
   multiple independently recoverable slices.
3. Use the specialized skill for the deepest risk area.
4. Return to `project-development-mindset` for documentation, project memory, and final reporting.
