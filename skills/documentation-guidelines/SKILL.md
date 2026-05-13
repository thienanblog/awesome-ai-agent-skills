---
name: documentation-guidelines
description: Create, reorganize, or update project documentation for monorepos or single-project repos with isolated app/service docs, full-file reading discipline, frontmatter, naming conventions, API contracts, workflows, architecture notes, endpoints, payloads, Mermaid diagrams, and local development instructions.
context: fork
---

# Documentation Guidelines

## Overview

Produce documentation that is easy to locate, owned by the correct app/service/module, and safe to use as a source of truth. Documentation must not mix unrelated runtimes or duplicate business rules across root docs and child projects.

Use this skill for monorepos and single-project repos. Do not require a repo-local `DOCUMENTATION_GUIDELINES.md`; apply the workflow below directly unless the repository has a newer explicit docs index or agent instruction that conflicts.

## Non-Negotiable Reading Rule

Before summarizing, moving, deleting, or editing documentation:

1. Read the complete target file, not just the first section or search hits.
2. Read the owning project `README.md` and `docs/README.md` when they exist.
3. For cross-area work, read the root docs index first when it exists, then the owning child docs.
4. Do not infer business logic from filenames, folder names, role display names, translated labels, or stale references.
5. If two docs appear duplicated, read both completely and identify the owner before deleting or merging.

## Determine Project Shape

### Monorepo

A repo is a monorepo when it has multiple independent apps/services such as `apps/*`, `services/*`, `packages/*`, or multiple deployable runtimes.

Use this structure:

```text
docs/
  README.md
  naming-and-structure.md
  runbooks/

apps/<app>/
  README.md
  docs/
    README.md
    architecture/
    features/
    workflows/
    reference/
    runbooks/
    memories/
    archives/

services/<service>/
  README.md
  docs/
    README.md
    architecture/
    features/
    workflows/
    reference/
    runbooks/
    memories/
    archives/
```

Root `docs/` should be an index and monorepo-level runbook area. Do not put app-specific `DESIGN_SYSTEM.md`, `ARCHITECTURE.md`, module docs, feature docs, workflow docs, or API contract docs at the monorepo root.

### Single Project

A single-project repo may keep all docs under its root `docs/` folder:

```text
docs/
  README.md
  architecture/
  features/
  workflows/
  reference/
  runbooks/
  memories/
  archives/
```

Single-project docs still need clear ownership by module/domain and must not duplicate business rules across multiple files without links to the source of truth.

## Ownership Rules

Place documentation by enforcement owner:

| Document Type | Owner |
| :--- | :--- |
| Auth, permission, validation, workflow, database, API resource, endpoint contract | Owning backend/API feature docs |
| WebSocket auth/profile/channel/event forwarding | WebSocket/realtime service docs |
| Admin web UI behavior, route guards, component usage | Admin web client docs |
| Mobile UX, storage, navigation, release rollout | Mobile client docs |
| Desktop UX, native bridges, installer/updater, design system | Desktop client docs |
| Device local behavior | Device client docs |

For cross-runtime features, write the enforcement contract in the owning service feature docs and link to consumer-specific UX/workflow docs from each app. Root docs should link, not duplicate. Avoid parallel `contracts/` folders unless the repository already has a non-duplicative convention for them.

## Workflow

1. Identify the owning app/service/module before editing.
2. Read the root agent/docs index if present.
3. Read the owning app/service `README.md`, local agent guide, and `docs/README.md` if present.
4. Read the complete existing doc(s) relevant to the change.
5. Decide whether the work is an index update, contract update, feature doc, workflow doc, runbook, memory/convention, or archive/move.
6. Create or update the doc in the owning docs folder. Remove obsolete content instead of appending contradictory sections.
7. Update all references to moved/renamed docs.
8. Verify with search that stale paths and removed terms no longer remain.

## Frontmatter

Every new or materially rewritten Markdown doc must start with YAML frontmatter:

```yaml
---
name: Human Readable Title
description: One sentence describing scope and owner.
version: 1.0.0
last_updated: YYYY-MM-DD
maintained_by: Team Or Owner
---
```

Preserve existing version/history when migrating a doc. Add missing frontmatter during the move.

## Naming Rules

- Use `README.md` as the entry point for every docs folder.
- Use kebab-case for normal docs: `account-settings.md`, `billing-workflow.md`.
- Keep all-caps standard docs only when intentionally named as standards, such as `DESIGN_SYSTEM.md`.
- Prefer stable filenames for linked docs.
- Use folder names by purpose: `architecture`, `features`, `workflows`, `reference`, `runbooks`, `memories`, `archives`.

## Required Content Checklist

For backend/API contract docs, include when applicable:

- Frontmatter.
- Purpose and scope.
- Consumers and ownership boundary.
- Architecture notes and key decisions.
- Controllers/routes, requests, resources, models, services, jobs, providers, and constants.
- Endpoint table, headers, payload examples, response examples, and error dictionary.
- Permissions, token abilities, feature flags, rate limits, audit rules, and client consumption rules.
- Mermaid ERD and/or Mermaid flowchart when it clarifies relationships or workflow.
- Local development, seeding/migration, verification commands, and troubleshooting/log hints.

For client/workflow docs, include when applicable:

- Frontmatter.
- Entry points/routes/screens.
- API or realtime contracts consumed, with links to owner docs.
- Local state/storage behavior.
- UX and rendering rules.
- Compatibility and rollout notes.
- Targeted test/verification commands.

## Style Rules

- Use frontmatter plus Markdown consistently.
- Use tables for endpoints, business rules, ownership maps, and route maps.
- Keep Mermaid labels short and wrap labels with punctuation in quotes.
- Keep docs concise but complete enough for a future engineer to avoid guessing.
- Delete obsolete text and stale references.
- Link to source-of-truth docs instead of copying business rules into multiple consumers.

## Verification

Before finishing:

- Search for old paths, removed file names, and stale guidance.
- Confirm root docs do not contain app/service-specific contracts or design/architecture docs in a monorepo.
- Confirm moved docs are discoverable from the root docs index and owning docs index.
- Confirm new docs have frontmatter.
- Confirm links resolve relative to the file location.

## Resources

- `references/documentation-guidelines.md`: Optional backend feature documentation structure reference when a deeper API contract template is needed.
