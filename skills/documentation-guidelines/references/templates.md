# Agent-First Documentation Templates

Use only the templates relevant to the artifact being created or substantially
rewritten. Preserve repository conventions and omit headings that do not apply.
Templates define information requirements, not a mandatory file hierarchy.

## Shared Writing Rules

- Put the business noun or capability in the title and use consistent terminology.
- Prefer compact facts, exact mappings, decision tables, and state tables over long
  narrative.
- Link required context directly. Do not rely on a reader discovering parent or
  dependency documents by searching.
- Document stable semantics and evidence anchors, not copied implementation or a
  complete source inventory.
- Record an unknown only when it is material and genuinely unresolved. Do not turn
  the document into a backlog.

## Module Or Bounded Context

```markdown
# Order Module

## Responsibility

- Business capability owned here.
- Scope and explicit non-goals.
- Terms whose meaning is specific to this module.

## Required Context

- Parent domain or architecture boundary.
- Shared contracts or decisions required for ordinary changes.

## Ownership Boundary

| Owned here | Owned elsewhere | Owner link |
| :--- | :--- | :--- |
| Order lifecycle and approval rules | Payment capture | Payment contract |

## Shared Business Rules

- Invariants that apply across the module's features.
- Permission or tenancy model.
- Consistency, transaction, retry, or idempotency requirements.

## Capabilities

| Capability | Outcome | Owner document |
| :--- | :--- | :--- |
| Approve order | Move an eligible order into approved state | Order approval |

## Integration Boundaries

| Dependency or consumer | Direction | Contract | Local consequence |
| :--- | :--- | :--- | :--- |

## Evidence Anchors

- Entrypoints, core domain symbols, schemas, and stable test suites.

## Additional Context

- Optional ADRs, runbooks, migration notes, or historical context.
```

## Feature Or Business Workflow

```markdown
# Order Approval

## Context

- Parent module and owner.
- Required contracts, decisions, and workflows.

## Outcome And Scope

- Business outcome.
- Included behavior and explicit non-goals.

## Actors And Permissions

| Actor | May do or observe | Preconditions or scope |
| :--- | :--- | :--- |

## Business Rules

- Invariants, validation, limits, ordering rules, and exceptional cases.
- State what must never happen when that boundary matters.

## Lifecycle

| Current state or trigger | Condition | Action | Result | Failure behavior |
| :--- | :--- | :--- | :--- | :--- |

Use a small diagram only when concurrency, branching, or multiple actors make the
table materially harder to understand.

## Contracts And Data

- Inputs, outputs, persisted facts, compatibility, and stable error semantics.
- Link authoritative technical contracts rather than copying their complete shape.

## Side Effects

- Events, jobs, notifications, billing, external calls, cache changes, or audit
  records.
- Transaction boundary, retry behavior, deduplication, and idempotency when relevant.

## Dependencies And Consumers

| Owner or consumer | Contract | Direction | Effect on this workflow |
| :--- | :--- | :--- | :--- |

## Evidence Anchors

- Source entrypoints, domain symbols, schemas, and focused test suites.

## Open Questions

- Only unresolved facts that materially affect behavior or implementation.

## Additional Context

- Optional runbooks, ADRs, migration records, or uncommon integration paths.
```

## Technical Contract

Use for an API, event, schema, shared package interface, or other independently
consumed boundary.

```markdown
# Approve Order Contract

## Ownership And Purpose

- Contract owner, intended consumers, guarantee, and exclusions.

## Required Context

- Parent feature, authorization model, compatibility policy, or shared schema.

## Interface

| Operation or event | Input | Output | Authorization or scope | Stable failures |
| :--- | :--- | :--- | :--- | :--- |

## Semantics

- Validation and business rules enforced at this boundary.
- Ordering, atomicity, delivery, retry, and idempotency guarantees.

## Compatibility And Migration

- Versioning, deprecation, rollout, and migration constraints when applicable.

## Consumers

| Consumer | Usage | Consumer-specific mapping |
| :--- | :--- | :--- |

## Evidence Anchors

- Schema or specification, implementation entrypoint, and contract tests.
```

## Consumer Workflow

```markdown
# Order Approval UI Workflow

## Local Responsibility

- Entry route or trigger, rendering, local state, interaction, and accessibility.

## Required Owned Contracts

| Contract | Owner | Local usage and mapping |
| :--- | :--- | :--- |

## Local Flow

- Client-only transitions, fallback behavior, stable error mapping, and recovery.

## Evidence Anchors

- Route or screen entrypoint and focused UI or integration tests.
```

Do not copy server permissions, validation, or lifecycle rules into the consumer.
Link those rules and record only their local consequence.

## Runbook

```markdown
# Order Recovery Runbook

## Purpose And Safety Boundary

- Intended outcome, target environment, authorization, and destructive-risk limit.

## Preconditions

- Required access, backups, health state, and inputs.

## Procedure

1. Exact action with expected observable result.

## Verification

- Signals that prove the operation succeeded and did not damage adjacent systems.

## Rollback Or Recovery

- Recoverable path, stopping condition, and escalation boundary.

## Known Failure Modes

| Symptom | Likely cause | Safe response |
| :--- | :--- | :--- |

## Evidence Anchors

- Scripts, commands, dashboards, configuration, or operational tests.
```
