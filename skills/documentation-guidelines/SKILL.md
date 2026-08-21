---
name: documentation-guidelines
description: Create, update, reorganize, or audit agent-first repository documentation that routes work to canonical module, feature, contract, workflow, and runbook context without duplication or stale task history.
---

# Documentation Guidelines

## Goal

Treat documentation as durable semantic context for agents. Capture what code cannot
safely explain alone: business intent, ownership, invariants, lifecycle, permissions,
side effects, contracts, operational constraints, and decision rationale. Let source
and tests own implementation detail and executable evidence.

Prefer compact facts over tutorial prose. Follow repository instructions and existing
conventions; do not impose a standard directory tree.

Run this skill in the main conversation. Delegation can increase usage; do not use
subagents unless the user explicitly approves the proposed agent count and scope.
Ask again before expanding an approved scope.

Read only the relevant reference:

- `references/templates.md` for module, feature, workflow, contract, or runbook docs.
- `references/architecture.md` for multi-owner routing, registries, and structure.
- `references/audit-cleanup.md` for broad audits, consolidation, or stale-doc removal.

## Context Protocol

Start with documentation before broad source exploration:

1. Read repository instructions and the nearest documentation router or index.
2. Read the owner document for the relevant scope.
3. Follow its required-context links for parent scope, contracts, dependencies,
   state models, decisions, and operational constraints.
4. Use named source and test anchors to verify missing, risky, or plausibly stale
   facts; do not rediscover the whole system from code by default.
5. Ask a targeted question only when docs, focused evidence, and history cannot
   resolve a fact or a product decision is required.

Do not cap reading by file count. Stop when the completeness gate passes, and do not
follow merely related links after that point. Mark required context separately from
additional context when the distinction prevents over-reading or missed dependencies.

## Context Completeness Gate

Before relying on docs, be able to state the applicable:

- Business outcome, scope, non-goals, and terminology.
- Actors, permissions, preconditions, and triggers.
- Rules, invariants, lifecycle or state transitions, and failure paths.
- Inputs, outputs, persisted facts, public contracts, and compatibility constraints.
- Side effects, transaction boundaries, retries, and idempotency expectations.
- Ownership boundaries, upstream dependencies, and downstream consumers.
- Authoritative source and test anchors, plus unresolved or intentionally unspecified
  behavior.

Omit inapplicable items. Treat an unknown applicable item as a documentation gap:
follow required context, verify focused evidence, and update its canonical owner when
the task includes documentation changes.

## Documentation Impact Gate

Update docs only when a durable fact would otherwise become wrong or undiscoverable.

| Change | Default action |
| :--- | :--- |
| Internal refactor, test-only change, formatting, or bug fix restoring documented behavior | No docs change unless a documented route or evidence anchor changed |
| User-visible behavior, business rule, workflow, or stable feature scope | Update its canonical owner |
| API, schema, event, permission, validation, compatibility, or cross-boundary contract | Update the contract owner and only affected consumer or relationship mappings |
| Setup, migration, deployment, recovery, queue, schedule, or operational behavior | Update the owning runbook or reference |
| Add, rename, move, archive, or remove an owned entity | Update its owner and minimum discovery routes |
| Obsolete, duplicated, or contradictory docs | Preserve valid facts in owners, fix routes, then remove the stale copy when Git history is sufficient |

Do not edit docs merely to record a review. Keep plans, raw commands, screenshots,
CI output, and implementation history in the task, pull request, tests, CI, or Git
unless they encode a durable operational requirement.

## Ownership And Routing

- Give every durable fact one canonical enforcement owner.
- Routers resolve ownership and link to context; they do not copy owner content.
- Consumer docs link to owned contracts and record only local mapping, behavior,
  error handling, or constraints.
- Add registries only when repeated discovery across many entities justifies them;
  generate alternate catalogs when practical.
- Map only dependencies that cross ownership boundaries and materially affect
  behavior, compatibility, deployment, data, or operations.
- Prefer existing names and layout. Stable headings, searchable business terms, and
  exact links matter more than prescribed filename suffixes.
- Use frontmatter only when tooling or routing consumes it. Avoid mechanical dates,
  versions, ownership fields, and status metadata that will rot.
- Keep historical records only for an active coordination, audit, legal, migration,
  or operational need, outside the default context path when possible.

## Authoring Rules

- Write facts, rules, boundaries, exceptions, negative rules, and compact examples;
  omit explanations of concepts a capable agent can infer reliably.
- Prefer stable headings, short bullets, exact mapping tables, and diagrams only for
  non-trivial flows or relationships.
- Provide a small set of stable evidence anchors: symbols, entrypoints, schemas,
  commands, or test suites rather than line numbers or source inventories.
- Separate required context, additional context, and evidence anchors when useful.
- Link another owner's contract instead of paraphrasing it; record only local
  consequences.
- Exclude placeholders, speculation, copied implementation, transient counts, and
  task-specific results from durable docs.

## Workflow

1. Apply the impact gate and identify each changed durable fact.
2. Discover existing routes and canonical owners.
3. Read enough owner and relationship context to pass the completeness gate; verify
   with focused source, tests, schemas, and configuration.
4. Update the smallest set of owner docs that would otherwise be wrong or incomplete.
5. Update routes, registries, or relationship maps only when discovery, identity,
   ownership, or cross-boundary context changed.
6. Remove contradictory copies; search for stale names, paths, IDs, links, contracts,
   and consumers.
7. Run focused documentation checks. After the documentation work is complete,
   list any broader repository or full-suite checks and ask the user whether to
   run them. Report changed durable context, unresolved gaps, or why no docs
   update was needed.

## Verification

Confirm that the shortest discoverable path reaches the correct owner and required
context; the completeness gate passes without broad code search; owner and consumer
docs do not compete; links, identifiers, relationships, and evidence anchors remain
current; and documentation fan-out is proportionate to the durable change.
