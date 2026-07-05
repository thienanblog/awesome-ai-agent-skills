---
name: project-development-mindset
description: Universal project development workflow for safe, maintainable software changes. Use when creating or modifying code, documentation, UI/UX, tests, architecture, design systems, debugging workflows, performance work, deployment preparation, or multi-repository features. Enforces source-of-truth-first discovery, reuse before creating new code, cohesive file boundaries, project memory alignment, testing, and visual QA for UI tasks.
---

# Project Development Mindset

Use this skill at the start of programming work. Treat it as an execution contract: understand the project before changing it, reuse what already exists, keep files cohesive, verify behavior, and keep durable project instructions synchronized.

## Operating Contract

- Start from the existing project, not from a generic solution.
- Read before changing code, docs, configuration, UI, tests, or deployment files.
- Prefer the smallest maintainable change that solves the task.
- Reuse existing components, services, wrappers, helpers, tokens, docs, tests, and conventions before creating new ones.
- Do not create a new abstraction, component, utility, style, animation, API client, validation rule, or workflow until you have checked whether the project already has one.
- Keep source of truth clear. Do not duplicate business rules, design rules, configuration, or project instructions across multiple places without a reason.
- Keep files cohesive. Do not combine page layout, domain logic, data access, validation, styling, test helpers, and design primitives in one file when the project has clearer boundaries.
- Do not move, delete, rename, or broadly restructure important files without user confirmation.
- Ask only when the decision is risky, destructive, ambiguous after inspection, related to credentials, production, billing, database migrations, deployment, or major architecture.
- Explain important technical decisions in plain language when the user may need the reasoning.

## Optional Same-Repository Skills

Reference other skills only when they exist in the same shared skills repository as this skill.

Before using an optional skill:

1. Locate this skill in the shared repository.
2. Verify that the sibling skill folder exists and contains a valid `SKILL.md`, such as `../documentation-guidelines/SKILL.md` from this skill folder or `skills/documentation-guidelines/SKILL.md` from the repository root.
3. If the skill is missing, tell the user the optional skill was not found and use the fallback guidance in this skill.

Optional skills to check before use:

- `documentation-guidelines`: use for feature, module, backend, API, workflow, and cross-repository documentation. Fallback: use the documentation rules below.
- `design-system-generator`: use for creating or updating `docs/DESIGN_SYSTEM.md`. Fallback: create a practical design system document manually.
- `agents-md-generator`: use for creating or updating `AGENTS.md`, `CLAUDE.md`, or equivalent project memory files. Fallback: create or update those files manually.
- `testing-verification`: use when testing, QA, CI checks, browser verification, visual screenshots, or acceptance criteria are a meaningful part of the task. Fallback: use the testing rules below.
- `debugging-workflow`: use when the task starts from an error, failing test with unclear cause, regression, log, stack trace, or broken behavior. Fallback: use the debugging rules below.
- `performance-optimization`: use when the task focuses on slowness, latency, memory, CPU, query count, bundle size, rendering lag, caching, or resource usage. Fallback: use the performance rules below.
- `vps-docker-traefik-deploy`: use for VPS, Docker Compose, and Traefik deployment planning or implementation. Fallback: provide general deployment guidance manually.

Do not reference, require, download, or depend on external skills or user-specific local paths.

## Source Of Truth Priority

Use the most specific durable project source before relying on assumptions.

Read in this order when relevant:

1. User request and any attached artifacts.
2. `AGENTS.md`, `CLAUDE.md`, or equivalent project instruction files.
3. `README.md`, `docs/README.md`, feature docs, architecture docs, runbooks, and design-system docs.
4. Framework, package, route, schema, migration, API, build, test, and deployment configuration.
5. Existing source files, components, services, tests, fixtures, logs, and examples near the task.
6. Official or current library documentation only after local project sources have been checked, unless the task is specifically about external API usage.

Rules:

- Do not rely on a filename alone. Verify path, imports, exports, routes, tests, docs links, and actual content.
- If multiple files, folders, modules, or docs have the same or similar names, determine which one owns the current business area before editing.
- If docs and code disagree, identify the conflict. Prefer the higher-authority project source only when the priority is clear; otherwise ask or state the assumption before implementing.
- Do not replace unusual business behavior with generic logic. Special cases often exist because the project needs them.
- When a task spans backend, frontend, admin, worker, mobile, API, or deployment repositories, inspect the related source of truth before changing only one side.

## Context Confidence Gate

Before substantial implementation, know enough to answer these questions:

- Which project instructions and docs govern this task?
- Which existing files are the source of truth for the affected behavior?
- Which reusable components, wrappers, services, hooks, composables, helpers, tokens, classes, tests, or scripts already exist?
- Which files are likely to change, and why?
- Which tests, checks, screenshots, or manual verification steps will prove the change?

For small local edits, this gate can be implicit, but still search enough to avoid duplicate code or incorrect business logic.

If confidence is low:

- Continue reading and searching before writing new code.
- Trace imports, exports, routes, component usage, test coverage, data flow, and docs links.
- Prefer asking a narrow question over guessing when the wrong choice would cause rework or business risk.

## Specialized Quality Routing

Read `references/quality-skill-routing.md` when deciding whether to stay in this general workflow or switch to a specialized quality skill.

- Use `testing-verification` for test planning, automated checks, UI screenshot verification, visual comparison, CI test failures, and acceptance criteria.
- Use `debugging-workflow` for unknown failures, broken behavior, logs, stack traces, regressions, flaky tests, and root-cause isolation.
- Use `performance-optimization` for measured slowness, query issues, rendering lag, memory/CPU pressure, caching, payload size, bundle size, and slow builds/tests.
- Use this skill as the coordinator when a task spans multiple concerns.

## General Workflow

### 1. Discover

- Inspect repository structure and active workspace roots.
- Identify stack, framework, package manager, lock file, build tool, test tool, lint/format tooling, deployment files, and documentation.
- Locate project instruction files, feature docs, design-system docs, existing tests, and examples.
- In multi-repository projects, inspect related repositories when the task clearly crosses boundaries.

### 2. Understand

- Read relevant docs and source before proposing or making changes.
- Identify business rules, special project behavior, data contracts, UI states, and validation rules.
- Confirm which existing pattern should be followed.

### 3. Plan

- For substantial tasks, create a short plan that names likely files, reusable surfaces, and verification strategy.
- Keep the plan reversible and scoped.
- For non-developers, explain the plan in plain language.

### 4. Implement

- Follow existing architecture, naming, folder organization, style, framework conventions, and package-manager conventions.
- Reuse before creating.
- Keep files cohesive and avoid broad refactors unrelated to the task.
- Do not introduce new libraries or tools unless the project lacks a reasonable existing solution and the benefit is clear.

### 5. Verify

- Run the most relevant targeted tests or checks first.
- Run broader tests when practical.
- For UI changes, use real-browser screenshots and interaction checks when available.
- If verification cannot be completed, explain why and provide the closest reliable check.

### 6. Document

- Update docs when behavior, architecture, setup, testing, deployment, logs, or project conventions change.
- Keep `AGENTS.md`, `CLAUDE.md`, and docs aligned.
- Document difficult bugs and their fixes in the related module docs.

### 7. Report

- Summarize what changed.
- List files changed or created.
- List tests, checks, screenshots, or manual verification performed.
- Mention docs updated.
- Mention anything not verified and any remaining risk.

## Reuse-First Implementation

Before creating anything new, search for existing equivalents:

- UI components, wrappers, layouts, slots, shells, cards, tables, forms, modals, side panels, toolbars, and navigation.
- Hooks, composables, stores, contexts, providers, services, repositories, API clients, SDK wrappers, validators, schemas, transformers, and formatters.
- Design tokens, theme config, Tailwind config, CSS variables, global classes, utility classes, animations, transitions, icons, and asset patterns.
- Tests, fixtures, factories, mocks, seeders, scripts, commands, jobs, and test utilities.
- Documentation pages, feature docs, runbooks, ADRs, and project memory files.

Rules:

- Prefer extending an existing shared surface over adding a near-duplicate local implementation.
- If two reusable surfaces overlap, identify the canonical one before building on either.
- If no reusable surface exists and the new behavior is likely to repeat, create the smallest project-consistent abstraction.
- If behavior is truly one-off, keep it local but still separate unrelated concerns.
- Do not add "helper" files that only hide one call site without improving clarity or reuse.

## File Boundaries And Architecture

Design files around responsibility, not convenience.

Rules:

- Keep route/page/controller files thin when the project has components, services, handlers, or use-case layers.
- Separate domain logic from UI rendering, data fetching, validation, formatting, and persistence when the project structure supports it.
- Split feature UI into shared components, feature components, wrappers, hooks/composables, constants, types, and services according to existing conventions.
- Avoid files that mix unrelated responsibilities simply because the task started in one file.
- Treat file size as a signal, not a strict rule. A long cohesive file can be acceptable; a shorter file with mixed responsibilities can still need refactoring.
- When editing an already-large file, avoid making it worse. Extract only the part directly related to the task and only when the extraction matches project patterns.
- Keep public APIs stable unless the task requires changing them.
- Do not create new folder structures that compete with existing architecture.

## UI/UX And Design System Contract

For UI work, inspect the source of truth before creating visual code.

Check when present:

- `docs/DESIGN_SYSTEM.md`, UI guidelines, screenshots, prototypes, design notes, or brand docs.
- Existing layout shells, page wrappers, section wrappers, form wrappers, table wrappers, modal wrappers, and empty/error/loading state components.
- Component library usage, local design primitives, theme providers, Tailwind config, CSS variables, global styles, tokens, icons, and asset conventions.
- Existing animations, transitions, motion utilities, responsive patterns, accessibility patterns, and custom classes.

Rules:

- Do not create one-off colors, spacing, typography, shadows, borders, transitions, animations, or custom classes when tokens or reusable utilities exist.
- Prefer shared components and wrappers for repeated UI patterns.
- Keep page-level code focused on composition and data flow.
- Match the project's density, tone, interaction model, and accessibility conventions.
- Verify important UI states: default, loading, empty, error, disabled, hover/focus when practical, validation, responsive behavior, and navigation.
- If the project lacks a design system, document the practical conventions discovered from existing UI before inventing new ones.

## User Images And Visual Clarification

When the user provides a UI/UX image, screenshot, mockup, or marked-up design:

- Inspect the image before deciding what to change.
- If the requested change is unclear, do not guess silently.
- Create an annotated copy of the image when the environment supports image generation or image editing. Use circles, arrows, or callouts to mark each unclear area.
- Give every marked area a short stable label such as `A`, `B`, `C`, or `Header spacing`, `Filter row`, `Primary action`.
- Ask concise questions using those labels so the user can answer unambiguously.
- Do not alter the user's original image; create a separate annotated artifact.
- If image annotation tooling is unavailable, describe the marked areas with clear labels, approximate positions, and the clarification questions.

For UI implementation from screenshots:

- Use Playwright MCP, Playwright, browser automation, or an equivalent real browser when available.
- Capture the specific element or region that needs work before capturing the full page.
- Use full-page screenshots only when the task depends on page-level layout, scroll behavior, viewport composition, or surrounding context.
- Capture before and after screenshots for visual changes when practical.
- Compare the target image, current screenshot, and updated screenshot at the same viewport or clearly state any viewport difference.
- Prefer screenshots of the exact component state being changed over broad screenshots that add noisy context.

## New Project Workflow

Use this when the project is empty, newly created, or still choosing a stack.

Create these folders and files when missing and appropriate:

- `README.md`
- `docs/`
- `docs/README.md`
- `deploy/`
- `deploy/README.md`
- `src/` only when appropriate for the selected stack

Rules:

- Respect framework-standard source folders such as `app/`, `pages/`, `packages/`, `backend/`, `frontend/`, `cmd/`, `internal/`, or equivalents.
- Do not force all source code into `src/` when that conflicts with the stack.
- Help the user choose a suitable stack when they have not chosen one.
- Explain tradeoffs in plain language.
- Initialize docs early.
- Check whether Git is installed, but do not create remotes, push code, or configure credentials without user confirmation.

## Existing Project Workflow

Use this when the project already contains source code, configs, docs, or deployment files.

Create missing docs only when safe:

- `README.md`
- `docs/`
- `docs/README.md`
- `deploy/`
- `deploy/README.md`

Rules:

- Do not force-create or migrate to `src/` if the project already has a framework-standard source structure.
- Create `src/` only when the project has no clear source folder and `src/` would improve clarity.
- Never move existing code into `src/` without user confirmation.

## Documentation Structure

Use `docs/features/` for feature and module documentation when the project has no stronger convention.

Recommended structure:

```text
docs/
  README.md
  DESIGN_SYSTEM.md
  features/
    customer/
      README.md
      customer-module.md
      customer-payment.md
    order/
      README.md
      order-module.md
      order-fulfillment.md
```

Rules:

- Give each major business module its own folder under `docs/features/`.
- Put a `README.md` in each module folder.
- Link from the module `README.md` to child documents in that module.
- Keep related docs together and keep docs practical.
- Include module purpose, user flows, business rules, source files, API endpoints, pages, components, jobs, commands, database tables, services, edge cases, limitations, testing notes, deployment notes, and links when relevant.
- Use `documentation-guidelines` only if it exists in the same shared skills repository. Otherwise, use this section as the fallback.

## Design System Documentation

For projects with UI, create or update `docs/DESIGN_SYSTEM.md` when the project lacks a durable design-system source of truth or when UI conventions change.

Use `design-system-generator` only if it exists in the same shared skills repository. Otherwise, create a practical `DESIGN_SYSTEM.md` with:

- Layout principles
- Typography
- Color usage
- Spacing
- Buttons
- Forms
- Tables
- Cards
- Modals
- Navigation
- Feedback states
- Loading, empty, and error states
- Responsive behavior
- Accessibility basics
- Component usage rules
- Animation and transition rules
- Custom class and token rules
- Examples from the current project

## Project Memory Files

Use `AGENTS.md`, `CLAUDE.md`, or equivalent project instruction files as durable project memory.

Use `agents-md-generator` only if it exists in the same shared skills repository. Otherwise, create or update these files manually.

Rules:

- Prefer `AGENTS.md` for Codex-style coding agents.
- Use `CLAUDE.md` if the project specifically uses Claude.
- Keep both files consistent if both are needed.
- Do not put everything into one huge instruction file.
- Move detailed content into `docs/` and link to it when instructions become too long.
- Update project memory when conventions, commands, logs, testing, design-system rules, deployment, architecture, or source-of-truth rules change.
- Do not store secrets, tokens, passwords, private keys, or sensitive credentials.
- When a repeated mistake or rework loop is discovered, add the durable rule to docs or project memory so it does not recur.

## Frameworks And External Libraries

- Prefer project code and docs first.
- Use current official documentation, Context7 MCP, or reliable documentation sources when the task depends on external API behavior or recent library changes.
- Do not invent APIs.
- Do not replace existing libraries with new ones without a strong reason.
- Avoid duplicate tools that solve the same problem.
- Use the existing package manager and lock file.

## Coding Conventions

- Match existing naming, formatting, folder organization, and code style.
- Use existing lint, format, test, build, and type-check commands.
- Do not introduce a new convention unless the project has no convention or the current convention is clearly harmful.
- For inconsistent projects, propose a cleanup plan instead of silently rewriting everything.

## Testing And Verification

Every coding task should have a testing strategy. Use `testing-verification` when test design, browser verification, visual QA, CI checks, or acceptance criteria are substantial.

Fallback rules:

- Use the existing test framework, fixtures, helpers, and commands.
- Run the most relevant targeted check first, then broader checks when practical.
- Add regression tests for bug fixes when practical.
- For UI, use real-browser checks when available; capture element/region screenshots before full-page screenshots.
- If no tests exist, propose the smallest useful setup or document exact manual verification steps.

## Performance And Optimization

Use `performance-optimization` when performance is the main concern.

Fallback rules:

- Measure or identify a concrete bottleneck before optimizing.
- Check database queries, backend work, network payloads, frontend rendering, assets, builds, and tests separately.
- Preserve business correctness and document cache invalidation rules.
- Apply low-risk optimizations when they directly support the task.
- Ask before broad architecture, infrastructure, or dependency changes.

## Errors, Logs, And Debugging

Use `debugging-workflow` when the task starts from an error, broken behavior, failing test, stack trace, log, regression, crash, or unknown cause.

Fallback rules:

- Reproduce the issue before fixing when possible.
- Read logs and source-of-truth docs before changing code.
- Isolate the smallest failing case and use fast checks first.
- Do not log secrets or sensitive data.
- Use Binary Debug only after normal reproduction, logs, and fast checks do not isolate the source.
- Document difficult bugs and fixes in related module docs or project memory.

## Deployment

Create or maintain deployment documentation in `deploy/README.md` and related files inside `deploy/`.

Use `vps-docker-traefik-deploy` only if it exists in the same shared skills repository. Otherwise, provide general deployment guidance manually.

Rules:

- Ask before touching production systems.
- Ask before changing DNS, domains, SSL, server configs, credentials, production environment variables, or deploy commands.
- Do not assume the user wants Docker, Traefik, rsync, CI/CD, or manual deployment.
- Help the user compare deployment options in plain language.
- Document the selected deployment method.
- Keep deployment scripts understandable and safe.

## Git And GitHub

- Check whether Git is installed when setting up or maintaining a project.
- If Git is available and the project is not initialized, suggest or initialize Git when appropriate.
- Do not force Git initialization if the project is inside another repository or monorepo.
- Do not create commits, branches, remotes, pushes, or pull requests without user confirmation unless the user clearly asked for it.
- Encourage GitHub, GitLab, Bitbucket, or another remote repository for backup and collaboration.

## Safety And Confirmation

Ask for confirmation before:

- Deleting files
- Moving many files
- Rewriting architecture
- Installing system-level tools
- Adding large dependencies
- Changing production configs
- Touching credentials
- Running database migrations in production
- Deploying
- Pushing to remote Git repositories
- Making irreversible changes

Do not ask for confirmation for safe, small, reversible actions such as:

- Reading files
- Creating missing docs folders
- Creating README files when missing
- Adding small docs updates
- Running local tests
- Running lint, type-check, or build commands
- Making minimal code changes requested by the user

## Plain-Language Support

When the user appears non-technical:

- Explain what you are doing and why.
- Avoid unexplained jargon.
- Translate technical terms into simple language.
- Provide clear choices when a decision is needed.
- Recommend a default option when appropriate.
- Explain risks before asking the user to choose.

## Final Response Checklist

At the end of each task, provide:

- What changed
- Files changed or created
- Tests, checks, screenshots, or manual verification run
- Documentation updated
- Anything that could not be verified
- Remaining risks or recommended next step, if any
