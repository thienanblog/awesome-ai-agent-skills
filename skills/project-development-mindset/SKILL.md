---
name: project-development-mindset
description: Universal developer mindset and project workflow guide for programming projects. Use when creating a new project, choosing or reviewing a tech stack, modifying an existing codebase, implementing features, fixing bugs, writing or updating documentation, designing architecture or folder structure, improving UI/UX consistency, adding tests, debugging errors, improving performance, preparing deployment, or working across multiple repositories. Useful for experienced developers, beginners, non-developers, founders, and anyone who needs AI assistance to build, maintain, document, test, debug, or deploy software safely.
author: "Ân Vũ"
---

# Project Development Mindset

Use this skill early for programming tasks, especially when the user has not provided detailed project conventions. Work from the existing project first, keep changes small and reversible, and explain important decisions in plain language.

## Core Mindset

- Respect the existing project first.
- Read before changing.
- Do not overwrite existing files without checking their content.
- Do not move, delete, or restructure important files without user confirmation.
- Prefer small, reversible changes.
- Keep documentation synchronized with code.
- Always consider testing before declaring work complete.
- Explain important technical decisions in plain language so non-developers can understand.
- Avoid guessing when the project already contains docs, conventions, configs, tests, logs, or architecture decisions.
- When uncertain, inspect the project first and make the safest reasonable assumption.
- Ask the user only when the decision is risky, destructive, related to credentials, deployment, production, billing, database migrations, or major architecture.

## Optional Same-Repository Skills

Reference other skills only when they exist in the same shared skills repository as this skill.

Before using an optional skill:
1. Locate this skill in the shared repository.
2. Verify that the sibling skill folder exists and contains a valid `SKILL.md`, such as `../documentation-guidelines/SKILL.md` from this skill folder or `skills/documentation-guidelines/SKILL.md` from the repository root.
3. If the skill is missing, tell the user the optional skill was not found in the shared repository and use the fallback instructions in this skill.

Optional skills to check before use:

- `documentation-guidelines`: use for feature, module, backend, and API documentation. Fallback: use the documentation structure and content checklist below.
- `design-system-generator`: use for creating or updating `docs/DESIGN_SYSTEM.md`. Fallback: create a practical design system document manually.
- `agents-md-generator`: use for creating or updating `AGENTS.md`, `CLAUDE.md`, or equivalent project memory files. Fallback: create or update those files manually.
- `vps-docker-traefik-deploy`: use for VPS, Docker Compose, and Traefik deployment planning or implementation. Fallback: provide general deployment guidance manually.

Do not reference, require, download, or depend on external skills or user-specific local paths.

## General Workflow

### 1. Discover

- Inspect the repository structure.
- Identify the tech stack, framework, package manager, test tooling, build tooling, deployment files, and documentation.
- Look for `README.md`, `docs/`, `AGENTS.md`, `CLAUDE.md`, package files, lock files, framework configs, Docker files, CI files, and existing tests.
- In multi-repository projects, check related repositories when the task clearly spans backend, frontend, API, admin panel, worker, mobile app, or deployment.

### 2. Understand

- Read existing documentation before changing code.
- Read relevant source files before proposing changes.
- Look for business rules and special project-specific behavior.
- Do not replace unique business logic with generic assumptions.

### 3. Plan

- Create a short implementation plan for substantial tasks.
- Mention files likely to change.
- Mention the testing strategy.
- For non-developers, explain the plan in simple language.

### 4. Implement

- Follow existing architecture, naming conventions, coding style, framework standards, and package manager conventions.
- Prefer minimal changes that solve the task.
- Do not introduce unnecessary new libraries.
- Use official documentation or local project conventions when working with frameworks or third-party libraries.

### 5. Test

- Run the most relevant targeted tests first.
- Then run the full available test suite when practical.
- If tests fail, fix the issue and rerun.
- If full tests cannot be run, clearly explain why and provide the closest reliable verification.

### 6. Document

- Update relevant documentation after code changes.
- Update feature docs, module docs, `README.md`, `AGENTS.md`, or `CLAUDE.md` when project behavior or instructions changed.
- Document difficult bugs and their solutions so the project does not repeat the same problem later.

### 7. Report

- Summarize what changed.
- List tests or checks that were run.
- Mention documentation updated.
- Mention anything that could not be verified.
- Mention remaining risks or recommended next steps.

## New Project Workflow

Use this when the project is empty, newly created, or still choosing a stack.

Create these folders and files when they do not already exist:

- `README.md`
- `docs/`
- `docs/README.md`
- `deploy/`
- `deploy/README.md`
- `src/` when appropriate for the selected stack

For frameworks that use a different standard source folder, such as `app/`, `pages/`, `packages/`, `backend/`, `frontend/`, `cmd/`, `internal/`, or another framework-specific structure, respect the framework standard. Do not force all source code into `src/` if that would conflict with the stack.

For a new project:

- Help the user choose a suitable tech stack if they have not chosen one.
- Explain tradeoffs in plain language.
- Recommend a simple, maintainable structure.
- Initialize documentation early.
- Create a `README.md` that explains project purpose, setup, development, testing, and deployment basics.
- Create `docs/README.md` as the documentation entry point.
- Create `deploy/README.md` as the deployment entry point.
- Check whether Git is installed.
- If Git is installed, initialize Git when appropriate and safe.
- If Git is not installed, guide the user to install it. Do not attempt system-level installation without user confirmation.
- Ask whether the user wants GitHub, GitLab, Bitbucket, or another Git hosting provider for safe remote backup.
- Do not create remotes, push code, or configure credentials without user confirmation.

## Existing Project Workflow

Use this when the project already contains source code, configs, docs, or deployment files.

Create these folders and files only if missing and safe:

- `README.md`
- `docs/`
- `docs/README.md`
- `deploy/`
- `deploy/README.md`

For `src/`:

- Do not force-create or migrate to `src/` if the project already has a framework-standard source structure.
- Create `src/` only when the project has no clear source folder and `src/` would improve clarity.
- Never move existing code into `src/` without user confirmation.

## Documentation Structure

Use `docs/features/` for feature and module documentation.

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
- Link from the module `README.md` to all child documents in that module.
- Keep related docs together.
- Use clear file names such as `customer-module.md`, `customer-payment.md`, and `customer-notifications.md`.
- Keep docs practical, not theoretical.

When writing module docs, include:

- Module purpose
- Main user flows
- Important business rules
- Related source files
- Related API endpoints, pages, components, jobs, commands, database tables, or services
- Special project-specific behavior
- Edge cases
- Known limitations
- Testing notes
- Deployment or configuration notes when relevant
- Links to child docs or related module docs

Use `documentation-guidelines` only if it exists in the same shared skills repository. Otherwise, use this section as the fallback.

## Design System

For projects with UI, create or update `docs/DESIGN_SYSTEM.md`.

Use `design-system-generator` only if it exists in the same shared skills repository. Otherwise, create a practical `DESIGN_SYSTEM.md` manually with:

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
- Loading states
- Empty states
- Error states
- Responsive behavior
- Accessibility basics
- Component usage rules
- Examples from the current project

## Project Memory Files

Use `AGENTS.md`, `CLAUDE.md`, or equivalent project instruction files when appropriate.

Use `agents-md-generator` only if it exists in the same shared skills repository. Otherwise, create or update these files manually.

Rules:

- If the project does not have `AGENTS.md` or `CLAUDE.md`, explain why a project instruction file is useful.
- Prefer `AGENTS.md` for Codex-style coding agents.
- Use `CLAUDE.md` if the project specifically uses Claude.
- Keep both files consistent if both are needed.
- Do not put everything into one huge instruction file.
- Move detailed content into `docs/` and link to it when instructions become too long.
- Treat these files as durable user and project memory.
- Update them when conventions, commands, logs, testing, deployment, or architecture instructions change.
- Do not store secrets, tokens, passwords, private keys, or sensitive credentials in these files.

## Architecture

Design and preserve folder structures that are scalable, maintainable, searchable, easy for new contributors to understand, aligned with framework standards, and consistent with the current codebase.

Rules:

- Respect framework conventions.
- Respect existing project conventions.
- Avoid unnecessary abstraction.
- Avoid creating too many layers too early.
- Prefer clear boundaries between modules, services, components, routes, data access, tests, and deployment.
- In monorepos or multi-repo systems, keep related documentation paths consistent across repositories.

## Multi-Repository Work

When a feature spans multiple repositories, use matching documentation paths where possible.

Example:

```text
api-repository/docs/features/customer/customer-module.md
frontend-repository/docs/features/customer/customer-module.md
```

Rules:

- If the user references only one repository or document but the feature clearly spans multiple repositories, inspect related docs in other available repositories.
- Prefer reading existing docs before making assumptions.
- Keep backend, frontend, deployment, and shared module docs aligned.
- Document cross-repository relationships clearly.

## Frameworks And External Libraries

- Prefer the project's existing code and docs first.
- Use Context7 MCP when available for current library documentation.
- If Context7 MCP is not available, use official documentation or reliable web search when allowed.
- Do not invent APIs.
- Do not replace existing libraries with new ones without a strong reason.
- Avoid fragmenting the project with duplicate tools that solve the same problem.

## Coding Conventions

- Match existing naming, formatting, folder organization, and code style.
- Use the existing package manager and lock file.
- Use existing lint, format, test, build, and type-check commands.
- Do not introduce a new convention unless the project has no convention or the current convention is clearly harmful.
- For inconsistent projects, propose a cleanup plan instead of silently rewriting everything.

## Testing Requirements

Every coding task should have a testing strategy.

Frontend:

- Prefer E2E testing for user-facing flows when practical.
- Use Playwright MCP, Chrome DevTools MCP, or browser-based verification when available.
- Use existing E2E tools if the project already has them.
- Use Jest, Vitest, Testing Library, or equivalent tools for source-level tests when appropriate.
- Check rendering, state behavior, forms, navigation, validation, loading states, and error states.

Backend:

- Use the existing backend test framework.
- PHP: prefer PHPUnit or the framework's standard testing tools.
- Go: write tests near source files using Go's standard testing package.
- Node.js: use the project's existing Jest, Vitest, Mocha, Node test runner, or equivalent.
- Test services, controllers, validation, data access, API responses, jobs, commands, and important business rules.

General loop:

- Code.
- Run the targeted test.
- Fix failures.
- Run relevant broader tests.
- Run the full test suite when practical.
- Call the task done only after tests pass or after clearly explaining why full verification was not possible.

If no tests exist:

- Propose the smallest useful testing setup.
- Add tests when the task scope allows.
- If adding a full framework is too large, document manual verification steps and recommend a future testing setup.

## Performance And Optimization

Stay aware of common performance issues in databases, backends, frontend rendering, media handling, and large data flows.

Database and SQL:

- Watch for N+1 queries.
- Prefer eager loading, joins, batching, indexing, pagination, and caching when appropriate.
- Check slow data fetching before assuming frontend issues.
- Be careful with large result sets and unnecessary data loading.
- Avoid returning huge JSON payloads when smaller responses, pagination, lazy loading, or field selection would work better.

Backend:

- Watch for memory-heavy recursion.
- Watch for large file processing issues.
- For PHP image processing, consider memory limits and common GD or ImageMagick issues.
- Use queues or background jobs for heavy tasks when appropriate.
- Use caching carefully and document invalidation rules.

Frontend:

- Watch for excessive re-rendering.
- Watch for prop drilling in React, Vue, or similar component systems.
- Suggest global state only when state is truly shared across broad parts of the app.
- Respect project preferences for Vue composables, React hooks, or similar patterns.
- Inspect parent components carefully before changing state flow.
- Avoid rendering very large JSON data directly.
- Use pagination, lazy loading, virtualization, memoization, or data splitting when appropriate.
- For images, prefer thumbnails, optimized previews, lazy loading, and an option to view the original image when needed.

Optimization rule:

- Apply low-risk optimizations when they directly support the task.
- For larger optimizations, document the recommendation and ask before making broad changes.

## Errors, Logs, And Debugging

Every project should have a practical way to inspect errors.

Rules:

- Identify where logs are written.
- If logging is missing, propose a simple logging approach.
- Make logs useful for debugging user-reported issues quickly.
- Do not log secrets, passwords, tokens, private keys, or sensitive personal data.
- Note important log locations and debugging commands in `AGENTS.md`, `CLAUDE.md`, or docs.
- When the user reports an error, read relevant logs first when available.
- Document difficult bugs and fixes in the related module docs.

Debugging strategy:

- Reproduce the issue.
- Isolate the smallest failing case.
- Disable or bypass large areas temporarily when safe.
- Narrow down step by step.
- Re-enable features after identifying the problem.
- Prefer fast error detection methods first.
- For TypeScript, run type checks, lint, or fast builds when available.
- For compiled frontend or script projects, run the fastest command that can expose the error before running heavier commands.

## Deployment

Create or maintain deployment documentation in `deploy/README.md` and related files inside `deploy/`.

Common deployment approaches include Docker, Docker Compose, Traefik, rsync-based scripts, VPS/server deployment, and CI/CD.

Use `vps-docker-traefik-deploy` only if it exists in the same shared skills repository. Otherwise, provide general deployment guidance manually.

Rules:

- Ask before touching production systems.
- Ask before changing DNS, domains, SSL, server configs, credentials, or production environment variables.
- Ask before running deploy commands.
- Do not assume the user wants Docker, Traefik, rsync, CI/CD, or manual deployment.
- Help the user compare deployment options in plain language.
- Document the selected deployment method.
- Keep deployment scripts understandable and safe.

## Git And GitHub

- Check whether Git is installed when setting up or maintaining a project.
- If Git is available and the project is not initialized, suggest or initialize Git when appropriate.
- Do not force Git initialization if the project is inside another repository or monorepo.
- Do not create commits, branches, remotes, or pushes without user confirmation unless the user clearly asked for it.
- Encourage GitHub, GitLab, Bitbucket, or another remote repository for backup and collaboration.
- Explain Git concepts simply for non-developers.

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
- Tests or checks run
- Documentation updated
- Anything that could not be verified
- Recommended next step, if any
