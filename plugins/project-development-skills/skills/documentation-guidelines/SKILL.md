---
name: documentation-guidelines
description: Create, reorganize, or update documentation for monorepos or single-project repos using root docs indexes, unique repo/module/feature identifiers, repo-owned detailed docs, cross-repo relationship maps, machine-readable frontmatter, API contracts, workflows, runbooks, testing, and debugging guidance.
context: fork
---

# Documentation Guidelines

## Overview

Produce documentation that is easy to locate, owned by the correct repo/module/feature, and safe to use as a source of truth. Use this skill for monorepos and single-project repos when creating, reorganizing, or updating architecture docs, module docs, feature docs, API contracts, workflows, runbooks, testing notes, or debugging guidance.

Apply the workflow directly unless the repository has newer explicit agent instructions or a newer docs index that conflicts.

For detailed templates, read `references/documentation-guidelines.md`.

## Non-Negotiable Reading Rule

Before summarizing, moving, deleting, or editing documentation:

1. Read the complete target file, not just search hits.
2. If root `docs/README.md` exists, read it first. It is the project routing index.
3. Read the owning repo `README.md`, local agent guide, and repo `docs/README.md` when they exist.
4. Read repo-level `modules.md` and `features.md` when resolving a module or feature.
5. Read all relationship docs marked `Required`.
6. Do not infer business logic from filenames, folder names, translated labels, role display names, or stale references.
7. If two docs appear duplicated, read both completely and identify the source-of-truth owner before deleting or merging.

## Project Shape

### Monorepo

A repo is a monorepo when it has multiple independent apps/services/packages or deployable runtimes, such as `apps/*`, `services/*`, or `packages/*`.

Use this documentation shape:

```text
docs/
  README.md
  naming-and-structure.md
  relationship-map.md
  runbooks/
  decisions/

apps/<repo>/
  README.md
  docs/
    README.md
    modules.md
    features.md
    architecture/
    modules/
    reference/
    runbooks/
    memories/
    archives/
```

Root `docs/` is a routing and coordination area. Detailed monorepo docs always live inside the owning repository, such as `apps/api/docs/...`, not under root `docs/<repo-id>/...`.

Root `docs/README.md` must link to each repo docs index, repo-level `modules.md`, and repo-level `features.md`. It must not copy every feature into a full global feature list.

### Single Project

A single-project repo may keep all docs under root `docs/`, but still uses the same index model:

```text
docs/
  README.md
  naming-and-structure.md
  modules.md
  features.md
  architecture/
  modules/
  reference/
  runbooks/
  memories/
  archives/
```

Use one repo prompt name for routing, such as `Main Repo`, `API Repo`, or a domain-specific project name.

## Routing Index Requirements

Root `docs/README.md` is the first file an AI agent should use to resolve natural-language prompts. It must include:

- Project shape: `monorepo` or `single-project`.
- Repo prompt names and repo IDs.
- Links to each repo docs index, `modules.md`, and `features.md`.
- A root Module Locator for quick module resolution.
- Cross-repo Relationship Map.
- Independent/tooling areas.
- AI reading workflow and update rules.

Repo-level `modules.md` lists modules owned by that repo. Repo-level `features.md` lists features owned by that repo.

## Global Uniqueness Rules

These identifiers must be unique across the whole project:

| Identifier | Example | Purpose |
| :--- | :--- | :--- |
| Repo prompt name | `API Repo` | Natural-language routing |
| Repo ID | `api` | Stable machine-readable repo key |
| Canonical module name | `Order Module` | Natural-language module routing |
| Module ID | `order` | Stable machine-readable module key |
| Canonical feature name | `Approve Order API` | Natural-language feature routing |
| Feature ID | `approve-order-api` | Stable machine-readable feature key |

When the same business concept appears in multiple repos, include owner or surface in the canonical name, such as `Approve Order API` and `Approve Order Office UI`.

Aliases are allowed only when each alias maps to exactly one canonical repo, module, or feature. Remove or narrow ambiguous aliases.

## Relationship Levels

Use only these values in relationship maps:

| Level | Meaning | AI Behavior |
| :--- | :--- | :--- |
| `Required` | Change may break another repo, contract, workflow, or test surface | Read before proposing or editing |
| `Recommended` | Related context may affect UX, rollout, tests, or integration quality | Read for design, contract, workflow, or user-facing work |
| `Optional` | Useful background only; not blocking | Mention as context and read only if the task needs it |
| `None` | No expected coordination | Do not broaden scope unless the prompt explicitly asks |

Independent/tooling repos must be marked `None` when they have no product runtime or contract dependency.

## Ownership Rules

Place documentation by enforcement owner:

| Information Type | Source of Truth |
| :--- | :--- |
| API payloads, responses, errors, permissions, validation, database rules | Owning backend/API module feature docs |
| UI routes, client state, rendering behavior, form flow | Owning client module feature docs |
| Background jobs, queues, schedules, retries | Owning worker/service module docs |
| Shared package public APIs | Owning package docs |
| Cross-repo dependency | Root relationship map plus owner docs |
| Local scripts and developer tooling | Tooling repo docs |

Consumer docs may summarize how they consume a contract, but must link to the owner doc instead of copying the full business rule.

## Workflow

When creating or updating docs:

1. Read root `docs/README.md` when present.
2. Resolve the repo prompt name, module name, and feature name from the user prompt.
3. If only a feature is named, use repo-level feature indexes linked from root `docs/README.md` to find its owner.
4. Read the owning repo docs index, repo `modules.md`, repo `features.md`, owning module `README.md`, and existing feature docs.
5. Read relationship docs marked `Required`; read `Recommended` docs for design, contract, workflow, and user-facing changes.
6. Decide whether the work is an index update, module doc, feature doc, API contract, workflow, runbook, memory/convention, archive/move, or cross-repo relationship update.
7. Create or update docs in the owning docs folder. Remove obsolete content instead of appending contradictory sections.
8. Update root and repo indexes when adding, renaming, moving, or archiving repos/modules/features.
9. Search for stale paths, old names, old IDs, and removed terms.
10. Verify links resolve relative to the file location.

If routing remains ambiguous after reading indexes, ask one targeted question instead of guessing.

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

Module docs must also include routing fields:

```yaml
repo_prompt_name: API Repo
repo_id: api
module_name: Order Module
module_id: order
module_aliases:
  - Orders
related_docs:
  - ../../features.md
```

Feature docs must also include feature routing fields:

```yaml
repo_prompt_name: API Repo
repo_id: api
module_name: Order Module
module_id: order
feature_name: Approve Order API
feature_id: approve-order-api
feature_aliases:
  - Order Approval API
related_docs:
  - ../README.md
  - ../../../features.md
```

Preserve existing version/history when migrating docs. Update `last_updated` and version when content changes materially.

## Required Content

For backend/API contract docs, include when applicable:

- Purpose, scope, consumers, and ownership boundary.
- Controllers/routes, requests, resources, models, services, jobs, providers, constants, and config.
- Endpoint table, headers, payload examples, response examples, and error dictionary.
- Permissions, token abilities, feature flags, rate limits, audit rules, and client consumption rules.
- Data model, state transitions, events, queues, cache behavior, side effects, and external dependencies.
- Local development, seed data, migrations, verification commands, troubleshooting hints, and test commands.

For client/workflow docs, include when applicable:

- Entry points, routes, screens, and workflow ownership.
- API or realtime contracts consumed, linked to owner docs.
- Local state/storage behavior and client-only constraints.
- UX/rendering rules without duplicating backend business rules.
- Compatibility, rollout, verification commands, and debugging notes.

## Style Rules

- Use frontmatter plus Markdown consistently.
- Use tables for repo names, module indexes, feature indexes, relationships, endpoints, business rules, route maps, error dictionaries, testing matrices, and debugging symptom maps.
- Use Mermaid for actor flows, system flows, state machines, and ERDs when helpful.
- Keep Mermaid labels short. Wrap labels with punctuation in quotes.
- Keep docs concise but complete enough for a future engineer to avoid guessing.
- Delete obsolete text and stale references.
- Link to source-of-truth docs instead of duplicating rules across consumers.

## Verification

Before finishing:

- Confirm new or moved docs are discoverable from root `docs/README.md` and the owning repo indexes.
- Confirm root docs do not contain detailed app/service contracts in a monorepo.
- Confirm repo/module/feature names and IDs are unique.
- Confirm independent/tooling areas have `None` relationship scope when appropriate.
- Confirm new docs have required frontmatter.
- Confirm links resolve relative to the file location.
- Search for stale paths, renamed files, old prompt names, old module names, and old feature names.

## Resources

- `references/documentation-guidelines.md`: Detailed templates for root indexes, repo-level module/feature indexes, module docs, feature docs, API contracts, client workflows, testing, debugging, and cross-repo relationship maps.
