# Specialized Skill Routing

Use this reference only after `project-development-mindset` has oriented to the
repository and a specialized concern may be the primary work. Do not preload the
catalog. Select at most one specialist for the current phase, and switch rather
than stack when evidence changes the primary concern.

`brainstorm-first` is not a child route. When its independent decision gate
applies, use it before implementation, stop for the user's selection, then begin
a new implementation phase with `project-development-mindset`.

## Routing Gate

Stay in the coordinator when specialized activity is only a supporting step.
Examples include targeted tests for a feature, a small required docs update,
running existing commands through Docker, using an already established Laravel
pattern, checking a UI change in a browser, or following an existing design
system.

Route only when one specialist owns the deepest current risk or the primary
deliverable:

| Primary work | Route when | Stay in the coordinator when |
|---|---|---|
| Root-cause isolation | An error, regression, flaky behavior, failing command, or broken integration has an unexplained cause | The cause and bounded fix are already known |
| Test and QA design | The deliverable is test strategy, coverage, regression coverage, acceptance verification, CI-check design, E2E, or visual comparison | Tests are focused evidence supporting implementation |
| Performance | A measured or clearly identified latency, resource, query, rendering, payload, caching, or build/test bottleneck is central | Performance awareness is only a normal implementation constraint |
| Documentation architecture | The deliverable is a broad docs audit, canonical ownership, contracts, module/feature docs, workflows, runbooks, or stale-content consolidation | A code change only needs its directly affected docs aligned |
| Repository instructions | The deliverable is creating, auditing, compacting, or restructuring `AGENTS.md`, `AGENTS.override.md`, or compatibility instructions | Existing instructions only need to be read or receive a small required update |
| Design-system documentation | The deliverable is generating or substantially updating `DESIGN_SYSTEM.md` and its durable rules | UI work only consumes an existing system or makes a one-off visual change |
| General visual-reference UI | A selected concept, single mockup, screenshot, visual reference, or reference site drives implementation | The UI edit does not depend on visual matching or concept persistence |
| Operational dashboard UI | An admin, internal, CRM/ERP, CRUD, reporting, or back-office surface is the primary implementation target | The surface is marketing, editorial, ecommerce, portfolio, game, or consumer UI |
| Local Docker development | Local Compose, Dockerfiles, service topology, mounts, ports, or supporting services are the main deliverable | Containers are only the project's existing command runner |
| Production VPS deployment | A self-hosted Docker/Traefik topology, host hardening, DNS, rollout, backup, restore, or rollback is central | Work is local Docker development or deployment-adjacent application code |
| Laravel 11/12 | The detected `laravel/framework` major is 11 or 12 and version-specific framework guidance materially owns implementation | Laravel is incidental to another primary workflow |
| Laravel 13 | The detected or target framework is Laravel 13, including a 12-to-13 upgrade, and version-specific guidance materially owns implementation | Laravel is incidental; never load this together with the 11/12 skill |
| Reviewable subtask delivery | The user explicitly requests or accepts the opt-in branch-and-commit workflow | A routine plan, large task, migration label, or the word “subtask” appears without opt-in |

Use names such as `debugging-workflow`, `testing-verification`,
`performance-optimization`, `documentation-guidelines`, `agents-md-generator`,
`design-system-generator`, `ui-ux-concept-implementation`,
`office-web-ui-system`, `docker-local-dev`, `vps-docker-traefik-deploy`,
`laravel-11-12-app-guidelines`, `laravel-13-app-guidelines`, or
`run-reviewable-subtask-loop` only when those skills are actually available. An
equivalent capability from another installed source is acceptable. Do not infer
availability from assumed filesystem paths, install optional skills silently, or
block ordinary work because a specialist is absent.

## Mutually Exclusive Routes

- Unexplained failures start with debugging. After the cause is known, switch to
  performance only for an established bottleneck or to testing only when test
  design becomes the remaining primary deliverable.
- Multiple unselected UI concepts belong to independent `brainstorm-first`.
  General UI concept implementation starts only after selection.
- Operational admin/dashboard UI uses `office-web-ui-system` when available,
  including screenshot-driven work; do not also load the general UI workflow by
  default.
- `design-system-generator` owns the durable design-system artifact, while UI
  implementation skills consume it. Do not load it merely to enforce existing
  tokens or components.
- `docker-local-dev` and `vps-docker-traefik-deploy` are mutually exclusive local
  and production topology routes.
- Load exactly one Laravel version skill after inspecting the installed or
  target framework major. A Laravel 12-to-13 upgrade belongs to the Laravel 13
  route.

## Transitions And Combined Tasks

For work spanning several concerns:

1. Establish project context, scope, authorization, and success criteria with
   the coordinator.
2. Choose the specialist for the deepest current risk, not every technology
   mentioned by the request or repository.
3. Let that specialist own its phase while the coordinator retains only
   cross-cutting constraints.
4. When the primary risk changes, stop the prior specialist workflow and route
   again.
5. Return to the coordinator for cross-boundary verification, durable context
   alignment, requirement-fit assessment, and reporting.

Security skills or capabilities remain separate and should be selected when the
primary question is exploitability, trust boundaries, sensitive data,
authorization, vulnerability validation, or remediation. Do not activate a
security workflow merely because ordinary implementation should be secure.
