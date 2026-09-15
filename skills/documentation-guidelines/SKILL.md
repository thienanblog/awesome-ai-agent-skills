---
name: documentation-guidelines
description: Create, audit, or consolidate durable project documentation, including feature rules, contracts, workflows, and runbooks. Use when documentation is the main deliverable; routine code changes can update their owning docs directly.
---

# Documentation Guidelines

Capture durable meaning that code alone does not explain: business intent, ownership, invariants, permissions, contracts, and operational decisions. Let source and tests own implementation details and executable evidence.

## Working agreement

Follow the user's request and applicable repository instructions over these defaults. Use existing authorization; ask only about missing decisions that materially affect scope, cost, safety, or the result. Continue independent authorized work while awaiting an answer.

Run in the main conversation by default. Delegation can increase usage: obtain explicit approval for the proposed agent count and scope before using subagents. Reuse that approval within its bounds; ask again before expanding the approved count or scope.

## Find the owner and evidence

Read the relevant documentation index and owner when present, then verify affected facts against source, tests, schemas, configuration, and runtime evidence. Follow links needed to understand the changed contract; stop when further reading no longer affects the result. Missing or stale documentation is a reason to inspect source, not a prerequisite that blocks work.

For the scope at hand, identify applicable actors, triggers, rules, state transitions, inputs/outputs, side effects, failure paths, ownership, and compatibility requirements. Omit irrelevant categories; record unresolved material facts without inventing them.

## Change docs when durable meaning changes

| Change | Documentation action |
|---|---|
| Internal refactor, formatting, or fix restoring documented behavior | Update only affected paths or evidence anchors, if any |
| User behavior, business rule, or workflow | Update its existing owner |
| API, schema, permissions, events, or compatibility | Update the contract and affected consumer mappings |
| Setup, migration, deployment, backup, or recovery | Update the owning runbook |
| Entity renamed, moved, or removed | Repair discovery routes and stale references |
| Duplicate or contradictory docs | Preserve valid facts in one owner, repair links, then remove stale copies within scope |

Avoid docs changes that merely record task activity. Keep transient plans, command logs, and CI output in the task, PR, or an existing evidence surface unless they represent a durable operating requirement.

## Write for discovery and maintenance

- Give each durable fact a clear owner. Consumers link to it and document only their own mapping or constraints.
- Follow the repository's layout. Add routers, registries, or metadata only when a real discovery or tooling need justifies their upkeep.
- Use concrete rules, stable searchable headings, examples, and a few source/test anchors. Prefer symbols and paths over brittle line numbers.
- Separate facts, recommendations, and unknowns. Remove generic tutorials, speculative requirements, copied implementation, and status metadata that will rot.
- Preserve historical records when they still serve an audit, migration, or operational purpose. Use Git history for superseded tracked content when sufficient.

Read [templates.md](references/templates.md) for the document type, [architecture.md](references/architecture.md) for multi-owner structure, or [audit-cleanup.md](references/audit-cleanup.md) for consolidation. These are selectable references, not required additions to every repository.

## Verify and report

Trace discovery from the existing entrypoint to the updated owner. Check links, identifiers, commands, evidence anchors, and any affected consumer contracts. Search for contradictory copies and old names. Run focused doc or generation validators plus applicable required gates; application tests are warranted only if the change affects executable behavior or their contract.

Report the durable facts changed, important removals or consolidations, verification, and remaining gaps. Do not add a full-suite permission question when no concrete verification gap remains.
