# Documentation Guidelines Reference

Use this reference when designing or reorganizing repository documentation. The
objective is reliable routing with the lowest practical maintenance fan-out.

## Contents

- [Source-of-truth model](#source-of-truth-model)
- [Recommended shapes](#recommended-shapes)
- [Router templates](#router-templates)
- [Canonical registry templates](#canonical-registry-templates)
- [Owner document templates](#owner-document-templates)
- [Impact examples](#impact-examples)
- [Audit checklist](#audit-checklist)

## Source-Of-Truth Model

Use four distinct layers:

| Layer | Owns | Must not own |
| :--- | :--- | :--- |
| Router | Links to canonical indexes and owner areas | Copied module/feature registries or implementation detail |
| Registry | Stable entity identity and owner link | Feature behavior, task history, test transcripts |
| Owner doc | Durable behavior or contract enforced by that owner | Full copies of another owner's rules |
| Work evidence | Pull request, tests, CI, Git | Long-term product documentation |

A progress hub owns only current state, a small priority list, and direct owner
links. Pending scope normally belongs in the active task or issue. A tracked
roadmap is optional and exists only for durable multi-milestone coordination.
An optional delivery record owns a concise summary only for significant work.

The default agent reading path is repository instructions, the progress hub
when present, and one owner doc. Routers resolve ambiguity; maps, ADRs,
runbooks, roadmaps, and delivery records are conditional context rather than
mandatory pre-reading.

## Recommended Shapes

### Monorepo

```text
docs/
  README.md
  project-progress.md
  relationship-map.md
  decisions/
  runbooks/

apps/api/docs/
  README.md
  modules.md
  features.md
  architecture/
  modules/
    order/
      order-module.md
      features/
        approve-order-api-feature.md
      workflows/
      runbooks/
  reference/
```

The same repo-local shape may be used for other apps. Do not add a root global
module table when repo-level module indexes already exist.

### Single Project

```text
docs/
  README.md
  project-progress.md
  modules.md
  features.md
  architecture/
  modules/
  runbooks/
  reference/
```

`features.md` is optional in either shape. Keep it only when it materially
improves discovery.

## Router Templates

### Root `docs/README.md`

```markdown
# Project Documentation

## Reading Workflow

1. Resolve the owning repository below.
2. Open its module index.
3. Read one owner document.
4. Read relationship docs only when the change crosses an ownership boundary.

## Repository Indexes

Include the Features column only for repositories that maintain a useful
`features.md` index.

| Repo | Responsibility | Docs | Modules | Features (if used) |
| :--- | :--- | :--- | :--- | :--- |
| API | Backend contracts | `apps/api/docs/README.md` | `apps/api/docs/modules.md` | `apps/api/docs/features.md` |
| Web | Client workflows | `apps/web/docs/README.md` | `apps/web/docs/modules.md` | `apps/web/docs/features.md` |

## Shared Areas

- [Progress](project-progress.md)
- [Relationship map](relationship-map.md)
- [Runbooks](runbooks/)
- [Architecture decisions](decisions/)

## Update Rules

- Update this router only when a repository, canonical index, or shared area changes.
- Do not copy module or feature rows here.
- Apply the documentation impact gate before editing docs.
```

### Repo `docs/README.md`

```markdown
# API Documentation

The API owns validation, authorization, persistence, and public contracts.

## Read Next

- [Modules](modules.md)
- [Features](features.md) (omit when this repository does not maintain a feature index)
- [Architecture](architecture/)
- [Runbooks](runbooks/)

This router does not copy module or feature rows.
```

## Canonical Registry Templates

### `modules.md`

```markdown
# API Modules

| Module | Module ID | Owner Doc | Responsibility | Required Relationships |
| :--- | :--- | :--- | :--- | :--- |
| Order Module | order | [Order module](modules/order/order-module.md) | Order state and API contracts | Web order workflow |
```

Update this file when the module is added, renamed, moved, archived, or
removed, or when an indexed owner link, responsibility, or relationship
changes. Do not update it for ordinary behavior changes not represented in the
table.

### Optional `features.md`

```markdown
# API Features

| Feature | Feature ID | Module | Owner Doc | Status |
| :--- | :--- | :--- | :--- | :--- |
| Approve Order API | approve-order-api | Order Module | [Contract](modules/order/features/approve-order-api-feature.md) | Active |
```

Update this index when a feature is added, renamed, moved, archived, or
removed, or when its indexed module, owner document, or status changes.

Do not use this index if it only repeats a complete list already maintained in
module docs or code-generated metadata.

## Owner Document Templates

### Module

```markdown
---
name: Order Module
description: Backend order ownership and stable contracts.
repo_id: api
module_id: order
maintained_by: Backend Team
---

# Order Module

## Purpose

State the responsibility and business outcome.

## Ownership Boundary

| Owned Here | Owned Elsewhere |
| :--- | :--- |
| State transitions, persistence, API rules | Web rendering and client state |

## Stable Source Paths

List only entry points future maintainers genuinely need.

## Public Contracts

Link to focused feature/contract docs.

## Operational Rules

Document migrations, jobs, cache, recovery, or environment requirements only
when they form a durable contract.

## Verification

List stable commands or test suites, not one task's pass counts or raw output.
```

### Feature Or API Contract

```markdown
---
name: Approve Order API
description: Contract for approving a pending order.
repo_id: api
module_id: order
feature_id: approve-order-api
maintained_by: Backend Team
---

# Approve Order API

## Outcome And Scope

Describe what the contract guarantees and what it excludes.

## Contract

| Method | Path | Auth/Scope | Request | Response | Errors |
| :--- | :--- | :--- | :--- | :--- | :--- |
| POST | `/api/orders/{order}/approve` | `orders:approve` | Approval payload | Order resource | Stable error codes |

## Rules

Document validation, authorization, state transition, side effects, and
compatibility that consumers cannot safely infer from code.

## Consumers

Link to consumer workflows. Do not copy their UI details.

## Migration And Operations

Include only when applicable.
```

### Consumer Workflow

```markdown
# Order Approval Workflow

## Local Ownership

Own route, rendering, client state, accessibility, and interaction behavior.

## Consumed Contracts

| Contract | Owner | Local usage |
| :--- | :--- | :--- |
| Approve Order API | API / Order Module | Submit action and map stable errors |

Link to the backend contract instead of copying its validation and permission
rules.
```

### Runbook

```markdown
# Order Recovery Runbook

## Preconditions

State target environment, authorization, backups, and non-destructive default.

## Procedure

Provide exact commands with expected safe outcomes.

## Verification

State how to prove recovery.

## Rollback

Provide a recoverable path and escalation boundary.
```

## Frontmatter Guidance

Use only fields consumed by routing or automation. Avoid mechanical metadata.

Recommended identity fields:

```yaml
---
name: Human-readable title
description: One-sentence owner and scope.
repo_id: api
module_id: order
maintained_by: Backend Team
---
```

Add `feature_id`, `status`, or `related_docs` only when they are useful.
Do not add `version` or `last_updated` unless the document represents a
real versioned contract or time-bounded information.

## Impact Examples

| Task | Expected docs fan-out |
| :--- | :--- |
| Rename a private helper | 0 |
| Add regression test for documented behavior | 0 |
| Fix implementation to match documented validation | 0 |
| Change one Customer workflow | 1 owner doc |
| Add a public API field used by one client | API contract plus client doc only if local behavior changes |
| Add a new module | Canonical module registry plus module owner doc; router only if its link structure changes |
| Change a shared token contract | One design-system owner plus affected local note only when ownership changes |
| Change migration/deploy procedure | Owning runbook |
| Complete a small bug fix | No delivery record |
| Complete a cross-app migration or production release | Optional significant delivery record |

## Audit Checklist

### Redundancy

- Does a root router copy rows already in repo indexes?
- Does a repo README copy `modules.md` or `features.md`?
- Does a naming guide list live module IDs already owned by a registry?
- Does a consumer duplicate backend validation, permissions, or error rules?
- Does a feature index contain implementation notes that belong in an owner doc?
- Do notes and progress hubs both maintain current status?
- Do completed plans duplicate PR and CI evidence?
- Do archives or redirects exist only to preserve information already present
  in Git history?

### Churn

- Which Markdown files change in most pull requests?
- Are `version` and `last_updated` bumped without contract meaning?
- Is a delivery record required for every task?
- Is a root design system updated for app-local implementation details?
- Does one ordinary code change require more than two docs edits?

### Consolidation

1. Name one owner for every duplicated fact.
2. Replace copied tables and summaries with links.
3. Keep one module registry per repo.
4. Make feature registries optional or generated.
5. Restrict progress updates to milestones.
6. Move durable decisions from completed plans or handoff notes into their
   owner docs or ADRs.
7. Delete obsolete plans, notes, redirects, and transcripts when Git history
   is sufficient; retain an archive only for a stated non-Git requirement.
8. Keep exact task evidence in PRs and CI.
9. Validate Markdown links and frontmatter references after consolidation.

### Cleanup Decision

| Document | Default action |
| :--- | :--- |
| Current owner contract or runbook | Keep and correct |
| Router that uniquely resolves ownership | Keep, but minimize |
| Active progress hub | Keep current state and a small priority list only |
| Multi-milestone roadmap with active owner | Keep until its stated removal condition |
| Completed or abandoned plan | Move durable decisions, remove references, delete |
| Temporary handoff/context note | Absorb durable facts, then delete |
| Monolithic delivery transcript | Delete when Git/PR history is sufficient |
| Archive required for audit, legal, operations, or migration | Retain outside the default reading path and state why |

## Verification Commands

Use repository-provided checks first. Useful generic checks include:

```sh
rg --files -g '*.md'
rg -n 'old-name|old-path|duplicate-id' .
git diff --check
```

When a link checker exists, run it on the affected documentation paths. Do not
introduce a new documentation tool solely for a one-time small edit.
