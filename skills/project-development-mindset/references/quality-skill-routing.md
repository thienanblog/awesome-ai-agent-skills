# Specialized Quality Routing

Use this reference only when a specialized concern is central to the task. Keep `project-development-mindset` as the cross-cutting baseline, let the most relevant specialized workflow lead, and avoid loading unrelated skills.

## Routing Decision

Stay in the general workflow when the task is a normal implementation or documentation change and specialized work is only a small supporting step.

Route to a specialized skill or capability when the task centers on one of these concerns:

- **Testing and verification:** test strategy, coverage, acceptance criteria, CI checks, browser verification, screenshot comparison, or visual regression.
- **Debugging:** unexplained errors, regressions, crashes, logs, stack traces, flaky behavior, failing commands, or root-cause isolation.
- **Performance:** measured slowness, query count, rendering lag, memory or CPU pressure, caching, payload size, bundle size, or slow builds and tests.
- **Documentation:** documentation architecture, feature or module docs, API contracts, workflows, runbooks, or cleanup of stale documentation.
- **Security:** threat modeling, security review, validation of findings, secure implementation, or remediation whose primary risk is security.
- **Deployment:** production architecture, container or infrastructure design, rollout planning, live operations, or environment-specific deployment work.
- **UI/UX concepts:** concept generation or selection, screenshot or mockup matching, visual references, or website emulation. Read `ui-ux-concept-routing.md` before proceeding.

Use names such as `testing-verification`, `debugging-workflow`, `performance-optimization`, `documentation-guidelines`, or `vps-docker-traefik-deploy` only when those skills are actually available. An equivalent capability from another installed source is acceptable. Do not discover availability from an assumed relative path, install missing skills silently, or block ordinary work because an optional skill is absent.

## Unknown Causes And Transitions

- Start with debugging when a failure or performance symptom has no established cause.
- Switch to performance guidance after evidence identifies a resource or latency bottleneck.
- Switch to testing guidance when the cause is understood and the remaining work is primarily regression coverage or acceptance verification.
- Use security guidance whenever the central question becomes exploitability, trust boundaries, sensitive data, authorization, or remediation of a vulnerability.

Do not keep multiple full workflows active after the primary risk changes. Retain only the cross-cutting constraints and the workflow that best matches the current problem.

## Multi-Slice Delivery

Consider `run-reviewable-subtask-loop` only for a large plan, migration, refactor, or roadmap that genuinely benefits from multiple independently reviewable and recoverable slices.

Use it only when the user explicitly requests it or explicitly accepts it during user-initiated planning before implementation. Do not activate it from routine internal planning, task size alone, or the existence of subtask boundaries. If it is unavailable or declined, use a proportionate plan in the main workflow.

## Combined Tasks

For work spanning several concerns:

1. Establish project context, scope, authorization, and success criteria with the general mindset.
2. Choose the specialized workflow for the deepest current risk.
3. Change routing if evidence shows another concern has become primary.
4. Return to the general mindset for cross-boundary verification, durable context alignment, and concise reporting.
