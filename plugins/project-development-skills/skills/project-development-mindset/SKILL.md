---
name: project-development-mindset
description: Adaptive, repository-aware baseline for ordinary implementation, refactoring, setup, and cross-cutting project changes. Use when modifying code, configuration, tests, or durable documentation to discover local conventions, choose the smallest coherent change, preserve project integrity, and calibrate verification to risk. Use as a coordinator when concerns interact; let a more specific skill lead when one concern clearly owns the task. Do not use for explanation-only or read-only requests unless explicitly invoked.
---

# Project Development Mindset

Use this skill as an adaptive baseline, not mandatory ceremony. Apply only the guidance relevant to the task. Scale discovery, planning, implementation, and verification to the task's impact, uncertainty, and reversibility.

## Precedence And Adaptation

- Follow system instructions, the user's current request, and applicable project instructions before this general guidance.
- Treat repository conventions as evidence of project intent, not as rules to copy blindly when they conflict with correctness, security, maintainability, or a more authoritative instruction.
- Let a more specific skill lead when it directly owns the task. Use this skill to preserve cross-cutting project awareness and proportionality.
- Apply routine gates implicitly for small, local work. Do not turn them into user-facing ceremony unless a decision or risk needs discussion.
- Preserve unrelated user changes and existing work. Do not clean up, revert, or broaden scope merely because nearby code could be improved.
- Run in the main conversation by default. Before spawning any subagent, agent team, or delegated worker, explain that delegation can increase usage and ask the user to approve the proposed agent count and scope. Ask again before expanding an approved scope.

## Core Outcomes

Aim for all of the following:

- Understand the project context that materially affects the requested behavior.
- Define what success means before making a substantial change.
- Implement the smallest coherent change that fully solves the task.
- Reuse existing project surfaces when their semantics and boundaries fit.
- Verify behavior with evidence proportionate to the likely failure cost.
- Keep durable sources of truth aligned when the change materially affects them.
- Stop when the requested outcome works, relevant checks pass, and no concrete requirement or observed risk justifies more work.

## Calibrate Effort To Risk

Judge the task using three factors:

- **Impact:** What users, data, systems, contracts, or workflows could be affected?
- **Uncertainty:** How well is the current behavior and intended outcome understood?
- **Reversibility:** How easily can the change be undone or corrected?

Adapt the workflow accordingly:

- For low-impact, well-understood, reversible work, inspect the nearby source, make the focused change, and run the most relevant check.
- For medium-risk or cross-boundary work, trace affected contracts and callers, use a short plan, and verify both the changed behavior and important adjacent behavior.
- For high-impact, uncertain, production-facing, security-sensitive, data-changing, or difficult-to-reverse work, investigate more broadly, make assumptions explicit, and resolve material decisions before acting.

Do not equate task size with risk. A one-line permission or migration change can require more care than a large mechanical refactor.

## Distinguish Authority From Evidence

Use each source for the question it can answer:

- **Desired outcome:** user request, acceptance criteria, and supplied artifacts.
- **Execution constraints:** system instructions and the most specific applicable project instructions.
- **Current behavior:** runtime evidence, source code, configuration, schemas, routes, tests, logs, and generated artifacts.
- **Design intent:** architecture decisions, feature documentation, runbooks, design systems, and project memory.
- **External contract:** version-matched official documentation, standards, and service or library specifications.

When sources disagree:

1. Identify whether the conflict concerns desired behavior, current behavior, or execution constraints.
2. Prefer the most authoritative and current source for that concern.
3. Check concrete runtime or test evidence when written sources may be stale.
4. Ask a narrow question only when the unresolved choice would materially change the outcome or risk; otherwise state a reasonable assumption and proceed.

Do not replace unusual behavior with generic logic until its purpose and callers are understood. Special cases may encode real business requirements.

## Make Proportionate Design Decisions

### Reuse And Abstraction

- Search the task-relevant area for existing components, services, helpers, schemas, tokens, tests, commands, and documentation before creating equivalents.
- Reuse an existing surface only when its semantics fit and reuse does not create unhealthy coupling or preserve a known defect.
- Extend a canonical shared surface when the new behavior belongs there; keep behavior local when it is genuinely isolated.
- Create an abstraction when it centralizes a real invariant, removes meaningful duplication, or follows an established project boundary. Do not create one only to hide a single call site or anticipate hypothetical flexibility.
- If an established pattern is harmful for the current case, make the smallest coherent improvement and explain why diverging is safer or clearer.

### Scope And Boundaries

- Add code only for a current requirement, an applicable project rule, or a concrete observed risk.
- Keep responsibilities cohesive and follow the project's existing architecture when it remains suitable.
- Touch adjacent files when required to preserve a contract, invariant, build, test, or user-visible behavior; avoid unrelated refactors.
- Treat file size as a signal, not a rule. Extract code only when the new boundary improves cohesion or current reuse.
- Keep public APIs and persisted data compatible unless the requested outcome requires a deliberate change.
- Do not add speculative extension points, compatibility layers, or options without a present use case. Handle realistic failure cases implied by current inputs, contracts, and operating conditions.

### Dependencies And External APIs

- Prefer an existing project dependency when it solves the problem well.
- Prefer a small local implementation when it is clear, reliable, easy to test, and meaningfully simpler than a new dependency.
- Add a dependency when it materially reduces correctness or security risk, implementation complexity, or maintenance cost and fits the project's runtime and package-management conventions.
- Do not duplicate tools that solve the same problem without a concrete migration or compatibility reason.
- Do not hand-roll cryptography, authentication protocols, complex parsers, or standards where a trusted and appropriate implementation is safer.
- Inspect the installed version and consult current, version-matched official documentation when behavior depends on an external API. Do not invent APIs.

## Act Within Authorization

Treat a clear user request as authorization for safe actions within its evident scope. Do not ask again merely because the task involves ordinary edits or verification.

Ask before proceeding when:

- An unresolved product or architecture choice would materially alter behavior or create substantial rework.
- The proposed action exceeds the apparent task scope or changes unrelated behavior.
- The action is destructive, difficult to reverse, or risks losing user work.
- Production systems, credentials, billing, sensitive data, deployment, DNS, or production migrations are involved and authorization is not already explicit.
- A broad dependency, infrastructure, or compatibility decision carries meaningful ongoing cost.

When a request already explicitly authorizes one of these actions, confirm only missing details or a newly discovered expansion of risk. Prefer a reversible assumption for low-risk ambiguity and report it.

## Adaptive Workflow

### 1. Orient

- Inspect the relevant repository structure, instructions, configuration, nearby source, tests, and documentation.
- In multi-project or multi-repository work, inspect each side of the affected contract before changing one side in isolation.
- Identify existing patterns worth reusing and any unrelated working-tree changes that must be preserved.

### 2. Define Success

- Translate the request into observable behavior, constraints, and relevant failure cases.
- Identify likely files and the evidence that would demonstrate success.
- Make a short plan only when coordination, uncertainty, or risk makes it useful.

### 3. Implement

- Follow suitable project naming, architecture, formatting, and package-manager conventions.
- Make the smallest coherent change that satisfies the defined outcome.
- Keep business rules, validation, configuration, and design decisions in clear sources of truth.

### 4. Verify

- Run the fastest relevant targeted check first, then broaden verification when impact or uncertainty justifies it.
- Verify observable behavior, not only command success. Include important negative or failure paths when they are part of the risk.
- Use the project's existing test framework, fixtures, scripts, and CI-equivalent commands when available.
- For material UI changes, inspect the result in a real rendering environment and check the states and viewports relevant to the request. Select tooling from capabilities available in the current environment and project; do not assume a universal tool ranking.
- If a reliable check cannot run, explain the limitation and perform the closest useful alternative without claiming full verification.

### 5. Align Durable Context

- Update documentation or project memory only when behavior, interfaces, setup, commands, architecture, deployment, or enduring conventions materially change.
- Follow the project's existing documentation structure. Do not create a documentation hierarchy, design system, deployment folder, or memory file without a concrete durable need.
- Keep secrets and sensitive credentials out of documentation, logs, fixtures, and project memory.

### 6. Report And Stop

- Lead with the outcome.
- Summarize material files or surfaces changed and verification performed.
- State anything not verified, assumptions that matter, and remaining risk or a useful next step.
- Avoid empty sections, exhaustive activity logs, and recommendations unrelated to the request.

## Specialized Skill Routing

Read `references/quality-skill-routing.md` when testing, debugging, performance, security, documentation, deployment, or multi-slice delivery is a primary concern rather than a supporting step.

Read `references/ui-ux-concept-routing.md` when the task includes concept generation or selection, a screenshot or mockup to match, a visual reference, or website emulation.

Routing rules:

- Use the current environment's available skill or capability catalog; do not depend on assumed filesystem locations or user-specific paths.
- Do not install, download, or require an optional skill silently. If it is unavailable, continue with this core workflow and the project's own guidance.
- Use any available specialized skill that more directly owns the task, regardless of where it was installed, provided it is compatible with higher-priority instructions.
- Load only the specialized guidance needed for the task. Do not stack every related skill by default.
- Use `run-reviewable-subtask-loop` only when the user explicitly requests it or accepts it during user-initiated planning for a genuinely multi-slice delivery. A routine implementation plan does not activate it.

## Context-Specific Defaults

- **New projects:** choose structure and tooling that fit the selected stack and immediate requirements. Do not force `src/`, `docs/`, deployment files, Git hosting, or a design system without a concrete need.
- **Existing projects:** preserve suitable architecture and conventions, but do not perpetuate a pattern that creates a demonstrated correctness, security, or maintainability problem.
- **Documentation-only work:** verify links, commands, ownership, and statements against authoritative project sources; avoid changing runtime code unless requested.
- **Bug fixes:** reproduce or establish convincing evidence of the failure, isolate the cause, and add regression coverage when it provides durable value.
- **Performance work:** measure or identify a concrete bottleneck before optimizing and preserve correctness while comparing results.
- **Deployment work:** distinguish planning or file preparation from operating a live environment, and require appropriate authorization for live changes.
